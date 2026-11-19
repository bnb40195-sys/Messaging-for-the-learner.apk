package dz.onefd.platform;

import android.Manifest;
import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "DeviceAccounts",
    permissions = {
        @Permission(
            alias = "accounts",
            strings = { Manifest.permission.GET_ACCOUNTS }
        )
    }
)
public class DeviceAccountsPlugin extends Plugin {

    @PluginMethod
    public void getGoogleAccounts(PluginCall call) {
        if (getPermissionState("accounts") != PermissionState.GRANTED) {
            requestPermissionForAlias("accounts", call, "accountsPermsCallback");
            return;
        }
        resolveGoogleAccounts(call);
    }

    @PermissionCallback
    private void accountsPermsCallback(PluginCall call) {
        if (getPermissionState("accounts") == PermissionState.GRANTED) {
            resolveGoogleAccounts(call);
        } else {
            JSObject ret = new JSObject();
            ret.put("accounts", new JSArray());
            ret.put("permissionDenied", true);
            call.resolve(ret);
        }
    }

    private void resolveGoogleAccounts(PluginCall call) {
        JSArray list = new JSArray();
        try {
            AccountManager manager = AccountManager.get(getContext());
            Account[] accounts = manager.getAccountsByType("com.google");
            for (Account account : accounts) {
                if (account.name != null && account.name.contains("@")) {
                    JSObject obj = new JSObject();
                    obj.put("email", account.name);
                    int atIdx = account.name.indexOf('@');
                    obj.put("name", atIdx > 0 ? account.name.substring(0, atIdx) : account.name);
                    list.put(obj);
                }
            }
        } catch (SecurityException ignored) {
            // Fall back to empty list if OS restricts silent reads
        }

        JSObject ret = new JSObject();
        ret.put("accounts", list);
        ret.put("permissionDenied", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void pickGoogleAccount(PluginCall call) {
        try {
            Intent intent = AccountManager.newChooseAccountIntent(
                null,
                null,
                new String[] { "com.google" },
                null,
                null,
                null,
                null
            );
            startActivityForResult(call, intent, "pickAccountResult");
        } catch (Exception e) {
            call.reject("Unable to open device account chooser", e);
        }
    }

    @ActivityCallback
    private void pickAccountResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }
        if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
            String email = result.getData().getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
            if (email != null && !email.trim().isEmpty()) {
                JSObject ret = new JSObject();
                ret.put("email", email.trim());
                int atIdx = email.indexOf('@');
                ret.put("name", atIdx > 0 ? email.substring(0, atIdx) : email);
                call.resolve(ret);
                return;
            }
        }
        JSObject cancelled = new JSObject();
        cancelled.put("cancelled", true);
        call.resolve(cancelled);
    }
}
