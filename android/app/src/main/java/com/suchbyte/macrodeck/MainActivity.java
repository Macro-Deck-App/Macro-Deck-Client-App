package com.suchbyte.macrodeck;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // The WebView's own long press vibrates and starts text selection before the button's long press
    // triggers, so it gets consumed without feedback
    final WebView webView = getBridge().getWebView();
    webView.setHapticFeedbackEnabled(false);
    webView.setOnLongClickListener(v -> true);

    getWindow().getDecorView().setSystemUiVisibility(uiVisibilityFlags);

    final View decorView = getWindow().getDecorView();
    decorView.setOnSystemUiVisibilityChangeListener(visibility -> {
      if((visibility & View.SYSTEM_UI_FLAG_FULLSCREEN) == 0)
      {
        decorView.setSystemUiVisibility(uiVisibilityFlags);
      }
    });
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus)
  {
    super.onWindowFocusChanged(hasFocus);
    getWindow().getDecorView().setSystemUiVisibility(uiVisibilityFlags);
  }

  final int uiVisibilityFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
    | View.SYSTEM_UI_FLAG_FULLSCREEN
    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
}
