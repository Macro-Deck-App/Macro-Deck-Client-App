import { Injectable } from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {ScreenOrientationType} from "../../enums/screen-orientation-type";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import {DiagnosticService} from "../diagnostic/diagnostic.service";


@Injectable({
  providedIn: 'root'
})
export class ScreenOrientationService {

  constructor(private settingsService: SettingsService,
              private diagnosticService: DiagnosticService) { }

  public async updateScreenOrientation() {
    if (!this.diagnosticService.isiOSorAndroid()) {
      return;
    }

    if (await this.diagnosticService.isAndroidOreo()) {
      return;
    }

    let screenOrientation = await this.settingsService.getScreenOrientation();
    try {
      switch (screenOrientation) {
        case ScreenOrientationType.Auto:
          await ScreenOrientation.unlock();
          break;
        case ScreenOrientationType.Landscape:
          await ScreenOrientation.lock({ type: OrientationType.LANDSCAPE_PRIMARY });
          break;
        case ScreenOrientationType.LandscapeAlt:
          await ScreenOrientation.lock({ type: OrientationType.LANDSCAPE_SECONDARY });
          break;
        case ScreenOrientationType.Portrait:
          await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
          break;
        case ScreenOrientationType.PortraitAlt:
          await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_SECONDARY });
          break;
      }
    } catch {
      console.log("Screen orientation lock not available")
    }
  }
}
