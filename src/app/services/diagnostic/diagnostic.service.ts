import { Injectable } from '@angular/core';
import {App} from "@capacitor/app";
import {Platform} from "@ionic/angular";
import {Device} from "@capacitor/device";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  constructor(private platform: Platform) { }

  async getVersion() {
    if (this.isiOSorAndroid()) {
      const info = await App.getInfo();
      return `v. ${this.versionPrefix()}-${info.version}`;
    }

    if (environment.carThing) {
      return "Car Thing";
    }

    return "Web Client";
  }

  async isAndroidOreo() {
    if (!this.isAndroid()) {
      return false;
    }

    let androidSdk = await this.getAndroidSdkVersion();
    return androidSdk == 26 || androidSdk == 27;
  }

  async getAndroidSdkVersion() {
    const info = await Device.getInfo();
    return info.androidSDKVersion;
  }

  public isAndroid() {
    return this.platform.is("android");
  }

  public isiOS() {
    return this.platform.is("ios");
  }

  private versionPrefix(): string {
    if (this.isAndroid()) {
      return "a";
    } else if (this.isiOS()) {
      return "i";
    }

    return "pwa";
  }

  public isiOSorAndroid() {
    return this.isiOS() || this.isAndroid();
  }
}
