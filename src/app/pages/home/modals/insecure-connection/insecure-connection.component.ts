import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-insecure-connection',
  templateUrl: './insecure-connection.component.html',
  styleUrls: ['./insecure-connection.component.scss'],
  imports: [
    IonicModule
  ]
})
export class InsecureConnectionComponent {

  constructor(private modalController: ModalController) { }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
