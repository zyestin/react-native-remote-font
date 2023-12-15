// RemoteFontLoaderModule.java

package com.yestin.font;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;

import android.graphics.Typeface;
import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;

import java.io.File;

public class RemoteFontLoaderModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RemoteFontLoaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RemoteFontLoader";
    }

    @ReactMethod
    public void loadFontFile(String pFontPath, int viewTargetId,  Promise pPromise) {
      if (pFontPath != null) {
          final View lView = this.getReactApplicationContext().getCurrentActivity().findViewById(viewTargetId);
          if (lView != null) {
              try {
                  File fontFile = new File(pFontPath);
                  if (fontFile.exists()) {
                      Typeface typeface = Typeface.createFromFile(fontFile);
                      // Attempt to coerce the TextView.
                      TextView pTextView = (TextView) (lView);
                      // Assign the Typeface.
                      pTextView.setTypeface(typeface);
                      // Ensure we update the View layout.
                      pTextView.measure(View.MeasureSpec.makeMeasureSpec(pTextView.getMeasuredWidth()-100, View.MeasureSpec.EXACTLY),
                              View.MeasureSpec.makeMeasureSpec(pTextView.getMeasuredHeight(), View.MeasureSpec.EXACTLY));
                      pTextView.layout(0, 0, pTextView.getMeasuredWidth(), pTextView.getMeasuredHeight());
                      pPromise.resolve(Arguments.createMap());
                  } else {
                      pPromise.reject("Error", "File not exists");
                  }

              } catch (final Exception pException) {
                  // Delegate the Exception to the caller.
                  pPromise.reject(pException);
              }
          }else{
              pPromise.reject("Error", viewTargetId + " view is not found");
          }

      }else{
          pPromise.reject("Error", "font filepath is null");
      }
  }
}
