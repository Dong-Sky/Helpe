package com.easygo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.wix.interactable.Interactable;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new Interactable(),
            new FBSDKPackage(),
            new RNI18nPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new MapsPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
