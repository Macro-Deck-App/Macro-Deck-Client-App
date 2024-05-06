import {Component, EventEmitter} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-connecting',
  templateUrl: './connecting.component.html',
  styleUrls: ['./connecting.component.scss'],
})
export class ConnectingComponent {

  message: string = "";
  canceled: EventEmitter<any> | undefined;

  constructor(private modalController: ModalController) { }

  async cancel() {
    this.canceled?.emit();
    await this.modalController.dismiss(null, 'cancel');
  }

  protected readonly environment = environment;
}
