import { Injectable } from '@angular/core';
import {App} from "@capacitor/app";
import {Platform} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  constructor(private platform: Platform) { }

  async getVersion() {
    if (Capacitor.isNativePlatform()) {
      await App.getInfo().then(info => {
        return `v${info.version}`;
      });
    }

    return "Web Version";
  }

  public isAndroid() {
    return this.platform.is("android");
  }

  public isiOS() {
    return this.platform.is("ios");
  }

  public isiOSorAndroid() {
    return this.isiOS() || this.isAndroid();
  }
}
