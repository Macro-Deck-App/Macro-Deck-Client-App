import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-connection-failed',
  templateUrl: './connection-failed.component.html',
  styleUrls: ['./connection-failed.component.scss'],
})
export class ConnectionFailedComponent   {

  name: string = "";
  errorInformation: string = "";

  constructor(private modalController: ModalController) { }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
