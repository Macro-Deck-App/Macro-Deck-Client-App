import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";
import {WakelockService} from "./services/wakelock/wakelock.service";
import {ScreenOrientationService} from "./services/screen-orientation/screen-orientation.service";
import {SslHandler} from "../../capacitor_plugins/sslhandler/src";
import {SettingsService} from "./services/settings/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: Storage,
              private wakeLockService: WakelockService,
              private screenOrientationService: ScreenOrientationService,
              private settingsService: SettingsService) {
  }

  async ngOnInit() {
    await this.storage.create();
    await this.screenOrientationService.updateScreenOrientation();
    try {
      await this.wakeLockService.updateWakeLock();
    } catch {
      // exception is expected in browser because wake lock needs user interaction
    }

    let skipSslValidation = await this.settingsService.getSkipSslValidation();
    SslHandler.skipValidation({value: skipSslValidation});
  }
}
