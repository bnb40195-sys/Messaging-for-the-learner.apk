import { Capacitor, registerPlugin } from '@capacitor/core';

export interface DeviceGoogleAccount {
  email: string;
  name?: string;
}

interface DeviceAccountsPlugin {
  getGoogleAccounts(): Promise<{
    accounts: DeviceGoogleAccount[];
    permissionDenied?: boolean;
  }>;
  pickGoogleAccount(): Promise<{
    email?: string;
    name?: string;
    cancelled?: boolean;
  }>;
}

const DeviceAccounts = registerPlugin<DeviceAccountsPlugin>('DeviceAccounts');

export function isNativeAndroidApp(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function fetchDeviceGoogleAccounts(): Promise<{
  accounts: DeviceGoogleAccount[];
  permissionDenied: boolean;
}> {
  if (!isNativeAndroidApp()) {
    return { accounts: [], permissionDenied: false };
  }

  try {
    const res = await DeviceAccounts.getGoogleAccounts();
    return {
      accounts: Array.isArray(res?.accounts) ? res.accounts : [],
      permissionDenied: Boolean(res?.permissionDenied),
    };
  } catch {
    return { accounts: [], permissionDenied: false };
  }
}

export async function pickNativeGoogleAccount(): Promise<DeviceGoogleAccount | null> {
  if (!isNativeAndroidApp()) {
    return null;
  }

  try {
    const res = await DeviceAccounts.pickGoogleAccount();
    if (res?.cancelled || !res?.email) return null;
    return { email: res.email.trim().toLowerCase(), name: res.name };
  } catch {
    return null;
  }
}

export async function promptBrowserCredentialAccount(): Promise<DeviceGoogleAccount | null> {
  if (typeof window === 'undefined' || !('credentials' in navigator)) return null;
  try {
    const cred = (await navigator.credentials.get({
      password: true,
      mediation: 'optional',
    } as CredentialRequestOptions)) as { id?: string; name?: string } | null;

    if (cred?.id && cred.id.includes('@')) {
      return {
        email: cred.id.trim().toLowerCase(),
        name: cred.name || undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function storeBrowserCredentialAccount(email: string, name?: string, password?: string) {
  if (typeof window === 'undefined' || !('credentials' in navigator)) return;
  try {
    const PasswordCredentialCtor = (
      window as unknown as {
        PasswordCredential?: new (data: {
          id: string;
          name?: string;
          password: string;
        }) => Credential;
      }
    ).PasswordCredential;

    if (!PasswordCredentialCtor) return;
    const cred = new PasswordCredentialCtor({
      id: email.trim().toLowerCase(),
      name: name?.trim() || email.split('@')[0],
      password: password || 'google-in-app',
    });
    await navigator.credentials.store(cred);
  } catch {
    // Ignore browser credential store rejections
  }
}
