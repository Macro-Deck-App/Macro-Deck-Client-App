import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { KeepAwake } from '@capacitor-community/keep-awake';
import NoSleep from 'nosleep.js';

@Injectable({
  providedIn: 'root',
})
export class WakelockService {
  private noSleep: NoSleep = new NoSleep();

  constructor(private settingsService: SettingsService) {}

  public async updateWakeLock() {
    try {
      if ((await this.settingsService.getWakeLockEnabled()) === true) {
        await this.enableWakeLock();
      } else {
        await this.disableWakeLock();
      }
    } catch {
      // exception is expected in browser because wake lock needs user interaction
    }
  }

  private async enableWakeLock() {
    const nativeSupport = await KeepAwake.isSupported();
    if (nativeSupport.isSupported) {
      await KeepAwake.keepAwake();
    } else {
      await this.noSleep.enable();
    }
  }

  private async disableWakeLock() {
    const nativeSupport = await KeepAwake.isSupported();
    if (nativeSupport.isSupported) {
      await KeepAwake.allowSleep();
    } else {
      this.noSleep.disable();
    }
  }
}
