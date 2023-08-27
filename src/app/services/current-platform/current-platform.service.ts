import { Injectable } from '@angular/core';
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class CurrentPlatformService {
  private _currentPlatform: any;

  constructor(private platform: Platform) {
    this.setCurrentPlatform();
  }

  isNative() {
    return this._currentPlatform === 'native';
  }

  isBrowser() {
    return this._currentPlatform === 'browser';
  }

  private setCurrentPlatform() {
    if (
      this.platform.is('ios') || this.platform.is('android')
      && !( this.platform.is('desktop') || this.platform.is('mobileweb'))) {
      this._currentPlatform = 'mobile';
    } else {
      this._currentPlatform = 'browser';
    }
  }
}
