import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.component.html',
  styleUrls: ['./connection-lost.component.scss'],
})
export class ConnectionLostComponent {

  constructor(private modalController: ModalController) { }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
