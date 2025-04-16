import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.component.html',
  styleUrls: ['./connection-lost.component.scss'],
  imports: [
    IonicModule
  ]
})
export class ConnectionLostComponent {

  constructor(private modalController: ModalController) { }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
