import {Component, EventEmitter, OnInit} from '@angular/core';
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {SettingsService} from "../../../../services/settings/settings.service";
import {WakelockService} from "../../../../services/wakelock/wakelock.service";
import {ScreenOrientationService} from "../../../../services/screen-orientation/screen-orientation.service";
import {SslHandler} from "../../../../../../capacitor_plugins/sslhandler/src";
import {environment} from "../../../../../environments/environment";
import {DiagnosticService} from "../../../../services/diagnostic/diagnostic.service";
import {ThemeService} from "../../../../services/theme/theme.service";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent  implements OnInit {

  public static settingsApplied: EventEmitter<any> = new EventEmitter();

  isAndroidOreo: boolean = false;
  preventScreenTimeout: boolean = false;
  showMenuButton: boolean = false;
  skipSslValidation: boolean = false;
  buttonLongPressDelay: number = 1000;
  appearanceType: string = "0";
  screenOrientation: string = "0";
  usbAutoConnect: boolean = false;
  usbPort: number = 8191;
  usbUseSsl: boolean = false;
  buttonWidgetBorderStyle: string = "0";

  constructor(private modalController: ModalController,
              private settingsService: SettingsService,
              private wakelockService: WakelockService,
              private alertController: AlertController,
              private screenOrientationService: ScreenOrientationService,
              public diagnosticService: DiagnosticService,
              private themeService: ThemeService) { }

  async ngOnInit() {
    await this.loadCurrentSettings();
    this.isAndroidOreo = await this.diagnosticService.isAndroidOreo();
  }

  async confirm() {
    await this.saveSettings();
    await this.modalController.dismiss(null, 'confirm');
    SettingsModalComponent.settingsApplied.emit();
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

  async saveSettings() {
    await this.settingsService.setWakeLockEnabled(this.preventScreenTimeout);
    await this.settingsService.setShowMenuButton(this.showMenuButton);
    await this.settingsService.setSkipSslValidation(this.skipSslValidation);
    await this.settingsService.setButtonLongPressDelay(this.buttonLongPressDelay);
    await this.settingsService.setAppearance(Number.parseInt(this.appearanceType));
    await this.settingsService.setScreenOrientation(Number.parseInt(this.screenOrientation));
    await this.settingsService.setUsbAutoConnect(this.usbAutoConnect);
    await this.settingsService.setUsbPort(this.usbPort);
    await this.settingsService.setUsbUseSsl(this.usbUseSsl);
    await this.settingsService.setButtonWidgetBorderStyle(Number.parseInt(this.buttonWidgetBorderStyle));

    await this.wakelockService.updateWakeLock();
    await this.screenOrientationService.updateScreenOrientation();
    await this.themeService.updateTheme();
    if (this.diagnosticService.isAndroid()) {
      SslHandler.skipValidation({value: this.skipSslValidation});
    }
  }

  async loadCurrentSettings() {
    this.preventScreenTimeout = await this.settingsService.getWakeLockEnabled();
    this.showMenuButton = await this.settingsService.getShowMenuButton();
    this.skipSslValidation = await this.settingsService.getSkipSslValidation();
    this.buttonLongPressDelay = await this.settingsService.getButtonLongPressDelay();
    this.appearanceType = (await this.settingsService.getAppearance()).toString();
    this.screenOrientation = (await this.settingsService.getScreenOrientation()).toString();
    this.usbAutoConnect = await this.settingsService.getUsbAutoConnect();
    this.usbPort = await this.settingsService.getUsbPort();
    this.usbUseSsl = await this.settingsService.getUsbUseSsl();
    this.buttonWidgetBorderStyle = (await this.settingsService.getButtonWidgetBorderStyle()).toString();
  }

  async preventScreenTimeoutChange(event: any) {
    if (event !== true) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Displaying a static image for a long time can cause screen burn-in on some screens.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async displayMenuButtonChange(event: any) {
    if (event !== false) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Information',
      message: 'To access the menu, swipe from the left edge of the screen',
      buttons: ['OK'],
    });

    await alert.present();
  }

  public isAndroid() {
    return this.diagnosticService.isAndroid()
  }

  public isiOSorAndroid() {
    return this.diagnosticService.isiOSorAndroid();
  }

  public isCarThing() {
    return environment.carThing;
  }
}
