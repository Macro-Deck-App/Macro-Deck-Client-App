import {Injectable} from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor(private loadingController: LoadingController) {
    }

    loadingMessage: any;

    async dismiss() {
        try {
            await this.loadingMessage?.dismiss();
            this.loadingMessage = undefined;
        } catch (error) {
            console.error(error);
        }
    }

    async showText(text: string) {
        try {
            await this.dismiss();
            this.loadingMessage = await this.loadingController.create({
                message: text
            });
            await this.loadingMessage.present();
        } catch (error) {
            console.error(error);
        }
    }
}
