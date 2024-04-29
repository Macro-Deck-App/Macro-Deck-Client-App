import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {SettingsService} from "../../../../services/settings/settings.service";
import {WakelockService} from "../../../../services/wakelock/wakelock.service";
import {ScreenOrientationService} from "../../../../services/screen-orientation/screen-orientation.service";
import {SslHandler} from "../../../../../../capacitor_plugins/sslhandler/src";
import {environment} from "../../../../../environments/environment.web";
import {DiagnosticService} from "../../../../services/diagnostic/diagnostic.service";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent  implements OnInit {

  preventScreenTimeout: boolean = false;
  showMenuButton: boolean = true;
  skipSslValidation: boolean = false;
  buttonLongPressDelay: number = 1000;
  screenOrientation: string = "0";

  constructor(private modalController: ModalController,
              private settingsService: SettingsService,
              private wakelockService: WakelockService,
              private alertController: AlertController,
              private screenOrientationService: ScreenOrientationService,
              public diagnosticService: DiagnosticService) { }

  async ngOnInit() {
    await this.loadCurrentSettings();
  }

  async confirm() {
    await this.saveSettings();
    await this.modalController.dismiss(null, 'confirm');
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

  async saveSettings() {
    await this.settingsService.setWakeLockEnabled(this.preventScreenTimeout);
    await this.settingsService.setShowMenuButton(this.showMenuButton);
    await this.settingsService.setSkipSslValidation(this.skipSslValidation);
    await this.settingsService.setButtonLongPressDelay(this.buttonLongPressDelay);
    await this.settingsService.setScreenOrientation(Number.parseInt(this.screenOrientation));
    await this.wakelockService.updateWakeLock();
    await this.screenOrientationService.updateScreenOrientation();
    if (this.diagnosticService.isAndroid()) {
      SslHandler.skipValidation({value: this.skipSslValidation});
    }
  }

  async loadCurrentSettings() {
    this.preventScreenTimeout = await this.settingsService.getWakeLockEnabled();
    this.showMenuButton = await this.settingsService.getShowMenuButton();
    this.skipSslValidation = await this.settingsService.getSkipSslValidation();
    this.buttonLongPressDelay = await this.settingsService.getButtonLongPressDelay();
    this.screenOrientation = (await this.settingsService.getScreenOrientation()).toString();
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

  protected readonly environment = environment;
}
