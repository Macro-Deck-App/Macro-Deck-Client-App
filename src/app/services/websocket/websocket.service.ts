import {EventEmitter, Injectable} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {Protocol2Messages} from "../../datatypes/protocol2/protocol2-messages";
import {SettingsService} from "../settings/settings.service";
import {InsecureConnectionComponent} from "../../pages/home/modals/insecure-connection/insecure-connection.component";
import {ProtocolHandlerService} from "../protocol/protocol-handler.service";
import {Subject, Subscription} from "rxjs";
import {LoadingService} from "../loading/loading.service";
import {webSocket} from "rxjs/webSocket";
import {environment} from "../../../environments/environment";
import {Connection} from "../../datatypes/connection";
import {NavigationService} from "../navigation/navigation.service";
import {NavigationDestination} from "../../enums/navigation-destination";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public isConnected: Boolean = false;

  private connecting: boolean = false;
  private closing: boolean = false;
  private url: string = "";
  private connection: Connection | undefined;
  private socket: WebSocketSubject<any> | undefined;
  private connectionClosed: Subject<CloseEvent> = new Subject<CloseEvent>();
  private connectionOpened: Subject<any> = new Subject<any>();

  public connectionLost: EventEmitter<any> = new EventEmitter<any>();
  public connectionFailed: EventEmitter<any> = new EventEmitter<any>();
  public connected: EventEmitter<any> = new EventEmitter<any>();
  public closed: EventEmitter<any> = new EventEmitter<any>();

  private subscription: Subscription = new Subscription();

  constructor(private loadingService: LoadingService,
              private modalController: ModalController,
              private settingsService: SettingsService,
              private protocolHandlerService: ProtocolHandlerService,
              private navigationService: NavigationService) {
    this.subscribeOpenClose();
  }

  public async connectToConnection(connection: Connection) {
    if (this.connecting || this.isConnected) {
      return;
    }

    if (connection.usbConnection) {
      await this.loadingService.showLoading(`Connecting via USB...`);
    } else {
      await this.loadingService.showLoading(`Connecting to ${connection.name}...`);
    }
    this.url = `${connection.ssl ? "wss://" : "ws://"}${connection.host}:${connection.port}`;
    this.connection = connection;
    await this.connect();
  }

  public async connectToString(connectionString: string) {
    this.url = connectionString;
    await this.loadingService.showLoading(`Connecting to Macro Deck...`);
    await this.connect();
  }

  public getConnection() {
    return this.connection;
  }

  private async connect() {
    this.closing = false;

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
        this.closed.emit();
        this.connecting = false;
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

  private subscribeOpenClose() {
    this.connectionClosed.subscribe(async closeEvent => {
      console.info("Closed with code " + closeEvent.code);
      await this.loadingService.dismiss();
      this.subscription.unsubscribe();
      this.closed.emit();
      this.connecting = false;

      if (!this.closing && closeEvent.code !== 1000) {
        await this.handleError(closeEvent);
        return;
      }

      this.isConnected = false;
      await this.navigationService.navigateTo(NavigationDestination.Home);
    });

    this.connectionOpened.subscribe(async () => {
      this.connected.emit();
      this.connecting = false;
      await this.settingsService.increaseConnectionCount();
      await this.settingsService.setLastConnection(this.connection?.id ?? "");
      this.protocolHandlerService.setWebsocketSubject(this.socket!);
      this.isConnected = true;
      await this.loadingService.showLoading("Waiting for the host to accept the connection...");
      let clientId = await this.settingsService.getClientId();
      this.socket?.next(Protocol2Messages.getConnectedMessage(clientId, this.connection?.token));
    });
  }

  public close() {
    console.log("Close requested");
    this.closing = true;
    this.socket?.complete();
    this.subscription.unsubscribe();
    this.connection = undefined;
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
      this.isConnected = false;
      await this.navigationService.navigateTo(NavigationDestination.ConnectionLost);
      return;
    }

    let closeDetails = `Code: ${closeEvent.code}\nReason: ${closeEvent.reason}\nWas clean: ${closeEvent.wasClean}`;
    this.connectionFailed.emit(closeDetails);
  }

  private async showInsecureConnectionModal() {
    const modal = await this.modalController.create({
      component: InsecureConnectionComponent
    });
    await modal.present();
  }
}
