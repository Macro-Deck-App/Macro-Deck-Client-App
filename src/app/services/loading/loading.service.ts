import {EventEmitter, Injectable} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ConnectingComponent} from "../../pages/home/modals/connecting/connecting.component";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor(private modalController: ModalController) {
    }

    canceled: EventEmitter<any> = new EventEmitter<any>();

    private openModal: any;

    async dismiss() {
        try {
            await this.openModal?.dismiss();
        } catch (error) {
            console.error(error);
        }
    }

    async showLoading(text: string) {
      await this.dismiss()
      this.openModal = await this.modalController.create({
        component: ConnectingComponent,
        componentProps: {
          message: text,
          canceled: this.canceled
        },
        backdropDismiss: false
      });
      await this.openModal.present();
    }
}
