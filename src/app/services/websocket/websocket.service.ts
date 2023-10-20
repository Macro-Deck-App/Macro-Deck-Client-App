import {Injectable} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {
    ConnectionFailedComponent
} from "../../pages/home/connections/modals/connection-failed/connection-failed.component";
import {Protocol2Messages} from "../../datatypes/protocol2/protocol2-messages";
import {SettingsService} from "../settings/settings.service";
import {
    InsecureConnectionComponent
} from "../../pages/home/connections/modals/insecure-connection/insecure-connection.component";
import {Router} from "@angular/router";
import {ProtocolHandlerService} from "../protocol/protocol-handler.service";
import {Subject} from "rxjs";
import {LoadingService} from "../loading/loading.service";
import {webSocket} from "rxjs/webSocket";
import {ConnectionLostComponent} from "../../pages/home/connections/modals/connection-lost/connection-lost.component";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    public isConnected: Boolean = false;

    private url: string = "";
    private socket: WebSocketSubject<any> | undefined;
    private connectionClosed: Subject<CloseEvent> = new Subject<CloseEvent>();
    private connectionOpened: Subject<any> = new Subject<any>();

    constructor(private loadingService: LoadingService,
                private modalController: ModalController,
                private settingsService: SettingsService,
                private router: Router,
                private protocolHandlerService: ProtocolHandlerService) {
        this.subscribeOpenClose();
    }

    public async connectToString(connectionString: string) {
      this.url = connectionString;
      await this.loadingService.showText(`Connecting to ${this.url}...`);

      this.socket = webSocket({
        url: this.url,
        closeObserver: this.connectionClosed,
        openObserver: this.connectionOpened
      });

      this.socket.subscribe({
        next: async (message: any) => {
          await this.protocolHandlerService.handleMessage(message);
        },
        error: async error => {
          await this.loadingService.dismiss();
          if (error instanceof DOMException) {
            switch (error.name) {
              case "SecurityError":
                await this.showInsecureConnectionModal();
                break;
            }
          }
        }
      });
    }

    public async connect(host: string, port: number, secure: boolean) {
        await this.connectToString((secure ? "wss://" : "ws://") + host + ":" + port);
    }

    private subscribeOpenClose() {
        this.connectionClosed.subscribe(async closeEvent => {
            console.info("Closed with code " + closeEvent.code);
            await this.loadingService.dismiss();

            switch (closeEvent.code) {
                case 1000:
                    // normal close
                    break;
                case 1005:
                case 1006:
                    if (!this.isConnected) {
                        await this.showConnectionFailedModal();
                    } else {
                        await this.showConnectionLostModal();
                    }
                    break;
            }

            this.isConnected = false;
            await this.router.navigate([''], {replaceUrl: false, skipLocationChange: true});
        })

        this.connectionOpened.subscribe(async () => {
            this.protocolHandlerService.setWebsocketSubject(this.socket!);
            this.isConnected = true;
            await this.loadingService.showText("Waiting for the host to accept the connection...");
            let clientId = await this.settingsService.getClientId();
            this.socket?.next(Protocol2Messages.getConnectedMessage(clientId));
        })
    }

    public close() {
        this.socket?.complete();
    }

    public send(payload: any) {
        this.socket?.next(payload);
    }

    private async showConnectionFailedModal() {
        const modal = await this.modalController.create({
            component: ConnectionFailedComponent,
            componentProps: {
                url: this.url
            }
        });
        await modal.present();
    }

    private async showInsecureConnectionModal() {
        const modal = await this.modalController.create({
            component: InsecureConnectionComponent
        });
        await modal.present();
    }

    private async showConnectionLostModal() {
      const modal = await this.modalController.create({
        component: ConnectionLostComponent
      });
      await modal.present();
    }
}
