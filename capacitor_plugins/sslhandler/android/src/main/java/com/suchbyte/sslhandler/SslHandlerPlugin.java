package com.suchbyte.sslhandler;

import android.net.http.SslError;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;
import android.app.AlertDialog;
import android.content.DialogInterface;

import com.getcapacitor.BridgeWebViewClient;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

class Options {
    public static boolean SkipSslValidation = false;
}

@CapacitorPlugin(name = "SslHandler")
public class SslHandlerPlugin extends Plugin {
    @PluginMethod
    public void skipValidation(PluginCall call) {
        Options.SkipSslValidation = call.getBoolean("value", false);
        call.resolve();
    }

    TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
        public X509Certificate[] getAcceptedIssuers() {
          return new X509Certificate[]{};
        }

        @Override
        public void checkClientTrusted(X509Certificate[] cert, String a) throws CertificateException {}

        @Override
        public void checkServerTrusted(X509Certificate[] cert, String a) throws CertificateException {}
    }};

    public void load() {
        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });
            HttpsURLConnection.setFollowRedirects(true);
        } catch (KeyManagementException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        this.bridge.setWebViewClient(new BridgeWebViewClient(this.bridge) {
            @Override
            public void onReceivedSslError(WebView view, final SslErrorHandler handler, SslError error) {
                if (Options.SkipSslValidation) {
                    handler.proceed();
                    return;
                }

                AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                builder.setTitle("SSL Certificate Error");
                builder.setMessage("The SSL certificate is invalid but you can continue anyways since the app is used in a local network and there is no sensitive data transmitted.\n\nYou can disable this warning in the settings.");

                builder.setPositiveButton("Continue", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        handler.proceed();
                    }
                });

                builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                    handler.cancel();
                    }
                });

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });
    }
}
