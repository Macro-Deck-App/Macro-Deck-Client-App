import {EventEmitter, Injectable} from '@angular/core';
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
import {Subject, Subscription} from "rxjs";
import {LoadingService} from "../loading/loading.service";
import {webSocket} from "rxjs/webSocket";
import {ConnectionLostComponent} from "../../pages/home/connections/modals/connection-lost/connection-lost.component";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public isConnected: Boolean = false;

  private closing: boolean = false;
  private url: string = "";
  private connectionId: string | undefined;
  private socket: WebSocketSubject<any> | undefined;
  private connectionClosed: Subject<CloseEvent> = new Subject<CloseEvent>();
  private connectionOpened: Subject<any> = new Subject<any>();

  public connectionLost: EventEmitter<any> = new EventEmitter<any>();

  private subscription: Subscription = new Subscription();

  constructor(private loadingService: LoadingService,
              private modalController: ModalController,
              private settingsService: SettingsService,
              private router: Router,
              private protocolHandlerService: ProtocolHandlerService) {
    this.subscribeOpenClose();
  }

  public async reconnect() {
    await this.connectToString(this.url);
  }

  public async connectToString(connectionString: string) {
    this.url = connectionString;
    this.closing = false;
    await this.loadingService.showLoading(`Connecting to ${this.url}...`);

    this.socket = webSocket({
      url: this.url,
      closeObserver: this.connectionClosed,
      openObserver: this.connectionOpened
    });

    this.subscription.add(this.loadingService.canceled.subscribe(() => {
      this.close();
    }))

    this.subscription = this.socket.subscribe({
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

  public async connect(host: string, port: number, secure: boolean, id: string) {
    await this.connectToString((secure ? "wss://" : "ws://") + host + ":" + port);
    this.connectionId = id;
  }

  private subscribeOpenClose() {
    this.connectionClosed.subscribe(async closeEvent => {
      console.info("Closed with code " + closeEvent.code);
      await this.loadingService.dismiss();
      this.subscription.unsubscribe();

      if (!this.closing) {
        await this.handleError(closeEvent);
      }

      this.isConnected = false;
      await this.router.navigate([''], {replaceUrl: false, skipLocationChange: true});
    });

    this.connectionOpened.subscribe(async () => {
      await this.settingsService.increaseConnectionCount();
      await this.settingsService.setLastConnection(this.connectionId ?? "");
      this.protocolHandlerService.setWebsocketSubject(this.socket!);
      this.isConnected = true;
      await this.loadingService.showLoading("Waiting for the host to accept the connection...");
      let clientId = await this.settingsService.getClientId();
      this.socket?.next(Protocol2Messages.getConnectedMessage(clientId));
    });
  }

  public close() {
    console.log("Close requested");
    this.closing = true;
    this.socket?.complete();
    this.subscription.unsubscribe();
    this.connectionId = undefined;
  }

  public send(payload: any) {
    this.socket?.next(payload);
  }

  private async handleError(closeEvent: CloseEvent) {
    // Normal close
    if (closeEvent.code == 1000) {
      return;
    }

    if (environment.webVersion) {
      this.connectionLost.emit();
      return;
    }

    if (this.isConnected) {
      await this.showConnectionLostModal();
      return;
    }

    let closeDetails = `Code: ${closeEvent.code}\nReason: ${closeEvent.reason}\nWas clean: ${closeEvent.wasClean}`;
    await this.showConnectionFailedModal(closeDetails);
  }

  private async showConnectionFailedModal(errorInformation: String) {
    const modal = await this.modalController.create({
      component: ConnectionFailedComponent,
      componentProps: {
        url: this.url,
        errorInformation: errorInformation
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
