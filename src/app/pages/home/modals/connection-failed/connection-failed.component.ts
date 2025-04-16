import { Component } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-connection-failed',
  templateUrl: './connection-failed.component.html',
  styleUrls: ['./connection-failed.component.scss'],
  imports: [
    IonicModule
  ]
})
export class ConnectionFailedComponent   {

  name: string = "";
  errorInformation: string = "";

  constructor(private modalController: ModalController) { }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
