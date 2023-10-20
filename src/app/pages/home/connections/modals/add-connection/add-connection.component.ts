import {Component} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {Connection} from "../../../../../datatypes/connection";

@Component({
  selector: 'app-add-connection-modal',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss'],
})
export class AddConnectionComponent {

  id: string = "";
  name: string | undefined;
  host: string = "";
  port: number = 8191;
  useSsl: boolean = false;

  constructor(private modalController: ModalController,
              private alertController: AlertController) {

  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!await this.validate()) {
      return;
    }

    let connection: Connection = {
      host: this.host,
      id: this.id,
      name: this.name === undefined || this.name.length === 0 ? this.host : this.name,
      port: this.port,
      ssl: this.useSsl
    }
    console.log(connection)
    await this.modalController.dismiss(connection, 'confirm');
  }

  async validate(): Promise<boolean> {
    if (this.host === undefined || this.host.length === 0) {
      await this.showErrorAlert("The IP Address / Hostname is required.");
      return false;
    } else if (this.port === undefined || this.port === null) {
      await this.showErrorAlert("The port is required.");
      return false;
    }

    return true;
  }

  async showErrorAlert(text: string) {
    const alert = await this.alertController.create({
      subHeader: text,
      buttons: [
        {
          text: 'Ok'
        }
      ],
    });

    await alert.present();
  }
}
