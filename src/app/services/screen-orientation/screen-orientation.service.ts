import { Injectable } from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {ScreenOrientationType} from "../../enums/screen-orientation-type";
import {ScreenOrientation} from "@capacitor/screen-orientation";

@Injectable({
  providedIn: 'root'
})
export class ScreenOrientationService {

  constructor(private settingsService: SettingsService) { }

  public async updateScreenOrientation() {
    let screenOrientation = await this.settingsService.getScreenOrientation();
    try {
      switch (screenOrientation) {
        case ScreenOrientationType.Auto:
          await ScreenOrientation.unlock();
          break;
        case ScreenOrientationType.Landscape:
          await ScreenOrientation.lock({orientation: "landscape"});
          break;
        case ScreenOrientationType.LandscapeAlt:
          await ScreenOrientation.lock({orientation: "landscape-secondary"});
          break;
        case ScreenOrientationType.Portrait:
          await ScreenOrientation.lock({orientation: "portrait"});
          break;
        case ScreenOrientationType.PortraitAlt:
          await ScreenOrientation.lock({orientation: "portrait-secondary"});
          break;
      }
    } catch {
      console.log("Screen orientation lock not available")
    }
  }
}
