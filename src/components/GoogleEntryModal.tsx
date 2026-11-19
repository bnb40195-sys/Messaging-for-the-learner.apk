import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  DeviceGoogleAccount,
  fetchDeviceGoogleAccounts,
  isNativeAndroidApp,
  pickNativeGoogleAccount,
  promptBrowserCredentialAccount,
  storeBrowserCredentialAccount,
} from '../lib/deviceAccounts';

interface GoogleEntryModalProps {
  isOpen: boolean;
  isMandatoryGate?: boolean;
  isAdmin?: boolean;
  activeEmail: string;
  savedEmails: string[];
  currentUser: FirebaseUser | null;
  onSelectEmail: (email: string) => void;
  onSignOut: () => void;
  onClose: () => void;
}

type AuthStep = 'menu' | 'google-picker' | 'google-add' | 'password' | 'direct-login';

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-purple-600',
  'bg-indigo-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
];

function loadProfiles(): Record<string, string> {
  try {
    const raw = localStorage.getItem('onefd_account_profiles');
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveProfileName(email: string, name: string) {
  const cleanName = name.trim();
  if (!cleanName) return;
  try {
    const profiles = loadProfiles();
    profiles[email.trim().toLowerCase()] = cleanName;
    localStorage.setItem('onefd_account_profiles', JSON.stringify(profiles));
  } catch {
    // Ignore storage errors
  }
}

function loadPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem('onefd_account_passwords');
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveAccountPassword(email: string, password: string) {
  try {
    const map = loadPasswords();
    map[email.trim().toLowerCase()] = password;
    localStorage.setItem('onefd_account_passwords', JSON.stringify(map));
  } catch {
    // Ignore storage errors
  }
}

const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.22 1.18-3.24 0-5.98-2.19-6.96-5.13H1.04v3.14C3.05 21.17 7.21 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.04 14.04c-.25-.74-.39-1.53-.39-2.34s.14-1.6.39-2.34V6.22H1.04C.38 7.54 0 9.03 0 11.7s.38 4.16 1.04 5.48l4-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.05 2.83 1.04 6.96l4 3.14c.98-2.94 3.72-5.35 6.96-5.35Z"
    />
  </svg>
);

export const GoogleEntryModal: React.FC<GoogleEntryModalProps> = ({
  isOpen,
  isMandatoryGate = false,
  isAdmin = false,
  activeEmail,
  savedEmails,
  currentUser,
  onSelectEmail,
  onSignOut,
  onClose,
}) => {
  const [step, setStep] = useState<AuthStep>('menu');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, string>>(() => loadProfiles());
  const [deviceAccounts, setDeviceAccounts] = useState<DeviceGoogleAccount[]>([]);
  const [isLoadingDeviceAccounts, setIsLoadingDeviceAccounts] = useState(false);

  const isAndroidNative = isNativeAndroidApp();

  useEffect(() => {
    if (isOpen) {
      setStep('menu');
      setErrorMessage(null);
      setPasswordInput('');
      setProfiles(loadProfiles());
    }
  }, [isOpen, activeEmail]);

  const loadAccountsFromPhone = async () => {
    setIsLoadingDeviceAccounts(true);
    try {
      if (isAndroidNative) {
        const res = await fetchDeviceGoogleAccounts();
        if (res.accounts.length > 0) {
          setDeviceAccounts(res.accounts);
          res.accounts.forEach((acc) => {
            if (acc.name) saveProfileName(acc.email, acc.name);
          });
          setProfiles(loadProfiles());
        }
      } else {
        const browserCred = await promptBrowserCredentialAccount();
        if (browserCred?.email) {
          setDeviceAccounts([browserCred]);
          if (browserCred.name) {
            saveProfileName(browserCred.email, browserCred.name);
            setProfiles(loadProfiles());
          }
        }
      }
    } finally {
      setIsLoadingDeviceAccounts(false);
    }
  };

  useEffect(() => {
    if (isOpen && step === 'google-picker') {
      loadAccountsFromPhone();
    }
  }, [isOpen, step]);

  // Merge accounts from the user's phone with the user's own saved device emails (never showing another person's admin email)
  const pickerAccounts = useMemo(() => {
    const map = new Map<string, DeviceGoogleAccount>();
    for (const acc of deviceAccounts) {
      const normalized = acc.email.trim().toLowerCase();
      if (normalized) {
        map.set(normalized, { email: normalized, name: acc.name });
      }
    }
    for (const email of savedEmails) {
      const normalized = email.trim().toLowerCase();
      if (normalized && !map.has(normalized)) {
        map.set(normalized, { email: normalized, name: profiles[normalized] });
      }
    }
    return Array.from(map.values());
  }, [deviceAccounts, savedEmails, profiles]);

  if (!isOpen) return null;

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());

  const getDisplayName = (email: string, explicitName?: string) => {
    if (explicitName && explicitName.trim()) return explicitName.trim();
    const normalized = email.trim().toLowerCase();
    if (profiles[normalized]) return profiles[normalized];
    if (currentUser?.email?.toLowerCase() === normalized && currentUser.displayName) {
      return currentUser.displayName;
    }
    return normalized.split('@')[0] || 'متعلم';
  };

  const getInitial = (email: string, explicitName?: string) => {
    const name = getDisplayName(email, explicitName).trim();
    return (name[0] || email[0] || 'U').toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = (hash * 31 + email.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  };

  const completeSignIn = async (email: string, optionalName?: string, optionalPassword?: string) => {
    const normalized = email.trim().toLowerCase();
    if (optionalName && optionalName.trim()) {
      saveProfileName(normalized, optionalName);
      setProfiles(loadProfiles());
    }
    if (!isAndroidNative) {
      await storeBrowserCredentialAccount(normalized, optionalName, optionalPassword);
    }
    setEmailInput('');
    setNameInput('');
    setPasswordInput('');
    setErrorMessage(null);
    onSelectEmail(normalized);
    onClose();
  };

  const handleOpenGoogleOption = () => {
    setErrorMessage(null);
    setStep('google-picker');
  };

  const handlePickNativePhoneAccount = async () => {
    setErrorMessage(null);
    const chosen = await pickNativeGoogleAccount();
    if (chosen?.email) {
      await completeSignIn(chosen.email, chosen.name);
    }
  };

  const handleGoogleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const normalized = emailInput.trim().toLowerCase();
    if (!validateEmail(normalized)) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح (مثال: name@gmail.com).');
      return;
    }
    await completeSignIn(normalized, nameInput);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const normalized = emailInput.trim().toLowerCase();
    if (!validateEmail(normalized)) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (passwordInput.trim().length < 4) {
      setErrorMessage('يرجى إدخال كلمة مرور لا تقل عن 4 أحرف.');
      return;
    }

    const storedPasswords = loadPasswords();
    if (storedPasswords[normalized] && storedPasswords[normalized] !== passwordInput) {
      setErrorMessage('كلمة المرور غير صحيحة لهذا البريد الإلكتروني.');
      return;
    }

    saveAccountPassword(normalized, passwordInput);
    await completeSignIn(normalized, undefined, passwordInput);
  };

  const handleDirectLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const normalized = emailInput.trim().toLowerCase();
    if (!validateEmail(normalized)) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح (مثال: name@gmail.com).');
      return;
    }
    await completeSignIn(normalized);
  };

  // Signed-in Profile View (when clicking user icon in Header while already logged in)
  if (activeEmail && step === 'menu') {
    return (
      <div
        onClick={() => {
          if (!isMandatoryGate) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#111318] text-white rounded-3xl p-6 shadow-2xl border border-white/10 space-y-5 relative"
        >
          {!isMandatoryGate && (
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col items-center text-center space-y-2 pt-1">
            <img
              src="/app-logo.png"
              alt="شعار بوابة المتعلم"
              className="w-14 h-14 rounded-2xl shadow-lg object-cover"
            />
            <h3 className="text-base font-black text-white">الحساب المسجّل في التطبيق</h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#1d2026] border border-white/10 flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'صورة الحساب'}
                className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-full ${getAvatarColor(activeEmail)} text-white font-black text-sm flex items-center justify-center shrink-0`}
              >
                {getInitial(activeEmail)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white truncate">
                  {getDisplayName(activeEmail)}
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>المشرف</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block truncate" dir="ltr">
                {activeEmail}
              </span>
            </div>
          </div>

          <div className={`grid gap-2.5 ${isAdmin ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('google-picker');
                }}
                className="py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>تبديل الحساب</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="py-3 px-4 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (!isMandatoryGate) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111318] text-white relative max-h-[92vh] flex flex-col"
      >
        {!isMandatoryGate && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* STEP 1: Sleek 3-Button Auth Menu (Matching Image 1) */}
        {step === 'menu' && (
          <div className="p-6 sm:p-7 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pt-1">
              <img
                src="/app-logo.png"
                alt="شعار بوابة المتعلم"
                className="w-16 h-16 rounded-2xl shadow-lg shadow-indigo-500/20 object-cover"
              />
              <div>
                <h3 className="text-lg font-black text-white">بوابة المتعلم الرقمية</h3>
                <p className="text-xs text-slate-400 mt-1">
                  اختر طريقة المتابعة للدخول إلى التطبيق
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Button 1: Continue with Google */}
              <button
                type="button"
                onClick={handleOpenGoogleOption}
                className="w-full py-3.5 px-5 rounded-full bg-[#181a20] hover:bg-[#22252d] border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
              >
                <GoogleGIcon className="w-5 h-5 shrink-0" />
                <span>المتابعة باستخدام Google</span>
              </button>

              {/* Button 2: Continue with Password */}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('password');
                }}
                className="w-full py-3.5 px-5 rounded-full bg-[#181a20] hover:bg-[#22252d] border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Lock className="w-4 h-4 text-white shrink-0" />
                <span>المتابعة بكلمة المرور</span>
              </button>

              {/* Button 3: Direct Sign In */}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('direct-login');
                }}
                className="w-full py-3.5 px-5 rounded-full bg-[#181a20] hover:bg-[#22252d] border border-white/20 text-white font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>تسجيل الدخول</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: In-App Google Account Picker showing the person's phone accounts (Matching Image 2) */}
        {step === 'google-picker' && (
          <div className="bg-[#2b2d31] text-white flex flex-col max-h-[85vh]">
            <div className="p-5 pb-4 border-b border-white/10 text-center relative">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('menu');
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                title="رجوع"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={loadAccountsFromPhone}
                className="absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                title="تحديث حسابات الهاتف"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDeviceAccounts ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex items-center justify-center gap-2 mb-1.5">
                <GoogleGIcon className="w-5 h-5" />
                <span className="text-base font-bold text-white">اختيار حساب</span>
              </div>
              <p className="text-xs text-slate-300">
                للمتابعة إلى <span className="font-bold text-white">بوابة المتعلم الرقمية</span>
              </p>
            </div>

            <div className="overflow-y-auto divide-y divide-white/10">
              {pickerAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => completeSignIn(acc.email, acc.name)}
                  className="w-full px-5 py-3.5 hover:bg-white/5 flex items-center gap-3.5 text-right transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(acc.email)} text-white font-bold text-sm flex items-center justify-center shrink-0`}
                  >
                    {getInitial(acc.email, acc.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">
                      {getDisplayName(acc.email, acc.name)}
                    </div>
                    <div className="text-xs text-slate-300 truncate" dir="ltr">
                      {acc.email}
                    </div>
                  </div>
                </button>
              ))}

              {/* Native Android System Phone Accounts Chooser */}
              {isAndroidNative && (
                <button
                  type="button"
                  onClick={handlePickNativePhoneAccount}
                  className="w-full px-5 py-3.5 hover:bg-white/5 flex items-center gap-3.5 text-right transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-indigo-200">
                      اختيار من جميع حسابات الهاتف
                    </div>
                    <div className="text-[11px] text-slate-400">
                      عرض كل حسابات Google المسجلة على هذا الهاتف
                    </div>
                  </div>
                </button>
              )}

              {/* Add Another Account row (matching Image 2 bottom item) */}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('google-add');
                }}
                className="w-full px-5 py-4 hover:bg-white/5 flex items-center gap-3.5 text-right transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 text-slate-200 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-100 block">إضافة حساب آخر</span>
                  {pickerAccounts.length === 0 && !isAndroidNative && (
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      اضغط لاختيار بريدك من الإكمال التلقائي للهاتف أو إدخاله
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2B: Add Another Google Account In-App (with phone keyboard email autofill enabled) */}
        {step === 'google-add' && (
          <div className="p-6 space-y-5 bg-[#2b2d31] text-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('google-picker');
                }}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                title="رجوع"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <GoogleGIcon className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">إضافة حساب Google</h3>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleGoogleAddSubmit} className="space-y-3.5" autoComplete="on">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني لحساب Google:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    dir="ltr"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pr-10 pl-4 py-3 rounded-2xl bg-[#1e1f22] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الاسم (اختياري):
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="مثال: أحمد"
                  className="w-full px-4 py-3 rounded-2xl bg-[#1e1f22] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                متابعة بالحساب
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Password Login View */}
        {step === 'password' && (
          <div className="p-6 space-y-5 bg-[#111318] text-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('menu');
                }}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                title="رجوع"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">المتابعة بكلمة المرور</h3>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5" autoComplete="on">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="username"
                    autoFocus
                    dir="ltr"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pr-10 pl-4 py-3 rounded-2xl bg-[#181a20] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    dir="ltr"
                    required
                    minLength={4}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-3 rounded-2xl bg-[#181a20] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-full bg-white text-slate-900 hover:bg-slate-200 font-black text-sm transition-colors cursor-pointer"
              >
                دخول
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Direct Sign-In View */}
        {step === 'direct-login' && (
          <div className="p-6 space-y-5 bg-[#111318] text-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('menu');
                }}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
                title="رجوع"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-white">تسجيل الدخول</h3>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleDirectLoginSubmit} className="space-y-3.5" autoComplete="on">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    dir="ltr"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pr-10 pl-4 py-3 rounded-2xl bg-[#181a20] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-full bg-white text-slate-900 hover:bg-slate-200 font-black text-sm transition-colors cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
