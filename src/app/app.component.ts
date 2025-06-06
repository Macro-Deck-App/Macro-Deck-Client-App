import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";
import {WakelockService} from "./services/wakelock/wakelock.service";
import {ScreenOrientationService} from "./services/screen-orientation/screen-orientation.service";
import {SslHandler} from "../../capacitor_plugins/sslhandler/src";
import {SettingsService} from "./services/settings/settings.service";
import {DiagnosticService} from "./services/diagnostic/diagnostic.service";
import {ThemeService} from "./services/theme/theme.service";
import {HomePage} from "./pages/home/home.page";
import {environment} from "../environments/environment";
import {WebHomePage} from "./pages/web-home/web-home.page";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {QuickSetupQrCodeData} from "./datatypes/quick-setup-qr-code-data";
import {QrCodeScannerComponent} from "./pages/home/modals/add-connection/qr-code-scanner/qr-code-scanner.component";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonicModule
  ]
})
export class AppComponent implements OnInit {
  public static quickSetupLinkScanned: EventEmitter<QuickSetupQrCodeData> = new EventEmitter();

  constructor(private storage: Storage,
              private wakeLockService: WakelockService,
              private screenOrientationService: ScreenOrientationService,
              private settingsService: SettingsService,
              private diagnosticService: DiagnosticService,
              private themeService: ThemeService) {
  }

  rootComponent = environment.webVersion ? WebHomePage : HomePage;

  async ngOnInit() {
    await this.storage.create();
    await this.screenOrientationService.updateScreenOrientation();
    await this.wakeLockService.updateWakeLock();
    await this.themeService.updateTheme();

    if (this.diagnosticService.isAndroid()) {
      let skipSslValidation = await this.settingsService.getSkipSslValidation();
      SslHandler.skipValidation({value: skipSslValidation});
    }

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const dataBase64 = event.url.split("quick-setup/").pop();
      if (dataBase64) {
        const dataJson = atob(dataBase64);
        const data = JSON.parse(dataJson) as QuickSetupQrCodeData;
        AppComponent.quickSetupLinkScanned.emit(data);
      }
    });
  }
}
