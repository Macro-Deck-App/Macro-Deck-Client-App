import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {SettingsService} from "../../../../services/settings/settings.service";
import {WakelockService} from "../../../../services/wakelock/wakelock.service";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent  implements OnInit {

  preventScreenTimeout: boolean = false;

  constructor(private modalController: ModalController,
              private settingsService: SettingsService,
              private wakelockService: WakelockService,
              private alertController: AlertController) { }

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
    await this.wakelockService.updateWakeLock();
  }

  async loadCurrentSettings() {
    this.preventScreenTimeout = await this.settingsService.getWakeLockEnabled();
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
}
