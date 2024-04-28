import { Injectable } from '@angular/core';
import {App} from "@capacitor/app";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  constructor(private platform: Platform) { }

  async getVersion() {
    return await App.getInfo().then(info => info.version);
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
