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
    if (this.isiOSorAndroid()) {
      const info = await App.getInfo();
      return `v. ${this.versionPrefix()}-${info.version}`;
    }

    return "Web Client";
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

    return "";
  }

  public isiOSorAndroid() {
    return this.isiOS() || this.isAndroid();
  }
}
