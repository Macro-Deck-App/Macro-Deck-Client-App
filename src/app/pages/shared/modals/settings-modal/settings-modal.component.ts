import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async confirm() {

    await this.modalController.dismiss(null, 'confirm');
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

}
