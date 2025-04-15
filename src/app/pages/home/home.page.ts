import {Component, OnInit} from '@angular/core';
import {
  AlertController, IonicModule,
  ItemReorderEventDetail,
  ModalController,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter
} from "@ionic/angular";
import {SettingsService} from "../../services/settings/settings.service";
import {environment} from "../../../environments/environment";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";
import {PingService} from "../../services/ping/ping.service";
import {Connection} from "../../datatypes/connection";
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {ConnectionService} from "../../services/connection/connection.service";
import {WebsocketService} from "../../services/websocket/websocket.service";
import {WakelockService} from "../../services/wakelock/wakelock.service";
import {Subscription} from "rxjs";
import {ConnectionFailedComponent} from "./modals/connection-failed/connection-failed.component";
import {AppComponent} from "../../app.component";
import {QuickSetupQrCodeData} from "../../datatypes/quick-setup-qr-code-data";
import {
  QrCodeScannerUiComponent
} from "./modals/add-connection/qr-code-scanner/qr-code-scanner-ui/qr-code-scanner-ui.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonicModule,
    QrCodeScannerUiComponent
]
})
export class HomePage implements OnInit, ViewWillEnter, ViewDidEnter, ViewDidLeave {
  clientId: string | undefined;
  version: string | undefined;
  savedConnections: Connection[] = [];
  availableConnections: string[] = [];
  savedConnectionsInitialized = false;
  usbConnectionAvailable: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private settingsService: SettingsService,
              private modalController: ModalController,
              private diagnosticsService: DiagnosticService,
              private connectionService: ConnectionService,
              private alertController: AlertController,
              private websocketService: WebsocketService,
              private wakeLockService: WakelockService,
              private pingService: PingService) {
  }

  ionViewWillEnter(): void {
    // Mapping because this creates a new array and not a reference
    this.availableConnections = this.pingService.availableConnections.map(object => object);
    this.usbConnectionAvailable = this.pingService.usbConnectionAvailable;
  }

  ionViewDidLeave(): void {
    this.pingService.stop();
    this.subscription.unsubscribe();
  }

  async ionViewDidEnter() {
    this.subscription = new Subscription();
    await this.loadConnections();
    this.subscription.add(this.pingService.connectionAvailable.subscribe(async connection => {
      if (!this.availableConnections.includes(connection.id)) {
        this.availableConnections.push(connection.id);
        if (connection.usbConnection) {
          this.usbConnectionAvailable = true;
          if (connection.autoConnect) {
            await this.connect(connection);
          }
          return;
        }

        let savedConnection = this.savedConnections.find(x => x.id == connection.id);
        if (savedConnection?.autoConnect === true) {
          await this.connect(savedConnection);
        }
      }
    }));
    this.subscription.add(this.pingService.connectionUnavailable.subscribe(connection => {
      if (connection.usbConnection) {
        this.usbConnectionAvailable = false;
      }
      if (this.availableConnections.includes(connection.id)) {
        this.availableConnections.splice(this.availableConnections.indexOf(connection.id), 1);
      }
    }));
    this.subscription.add(this.websocketService.closed.subscribe(async () => {
      await this.pingService.start();
    }));
    this.subscription.add(this.websocketService.connectionFailed.subscribe(async details => {
      await this.showConnectionFailedModal(details);
    }));
    this.subscription.add(AppComponent.quickSetupLinkScanned.subscribe(async data => {
      await this.openAddConnectionModal(null, data);
    }));
    await this.pingService.start();
  }

  private async loadConnections() {
    this.savedConnections = await this.connectionService.getConnections() ?? [];
    this.savedConnectionsInitialized = true;
  }

  async openAddConnectionModal(existingConnection?: Connection | null, quickSetupQrCodeData?: QuickSetupQrCodeData | null) {
    this.pingService.stop();
    let props = {};

    if (existingConnection) {
      props = {
        id: existingConnection?.id,
        name: existingConnection?.name,
        host: existingConnection?.host,
        port: existingConnection?.port ?? 8191,
        useSsl: existingConnection?.ssl ?? false,
        autoConnect: existingConnection?.autoConnect ?? false,
        index: existingConnection?.index ?? 0,
        editConnection: true
      };
    } else if (quickSetupQrCodeData) {
      props = {
        quickSetupQrCodeData: quickSetupQrCodeData
      };
    }

    const modal = await this.modalController.create({
      component: AddConnectionComponent,
      componentProps: props,
      cssClass: "scanner-hide"
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.connectionService.addUpdateConnection(data);
    }

    await this.loadConnections();
    await this.pingService.start();
  }

  async handleReorder({event}: { event: CustomEvent<ItemReorderEventDetail> }) {
    this.savedConnections = event.detail.complete(this.savedConnections);
    this.updateIndexes()
    await this.connectionService.saveConnections(this.savedConnections);
  }

  private updateIndexes() {
    for (let i = 0; i < this.savedConnections.length; i++) {
      this.savedConnections[i].index = i;
    }
  }

  async deleteConnection(connection: Connection) {
    const alert = await this.alertController.create({
      subHeader: `Delete the connection ${connection.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: async () => {
            await this.connectionService.deleteConnection(connection.id);
            await this.loadConnections();
          },
        }
      ],
    });

    await alert.present();
  }

  async editConnection(connection: Connection) {
    await this.openAddConnectionModal(connection);
  }

  async connect(connection: Connection) {
    await this.wakeLockService.updateWakeLock();
    await this.websocketService.connectToConnection(connection);
  }

  async connectUsb() {
    let usbConnection: Connection = await this.connectionService.getUsbConnection();
    await this.connect(usbConnection);
  }

  async ngOnInit() {
    this.clientId = await this.settingsService.getClientId();
    this.version = await this.diagnosticsService.getVersion();
  }

  protected readonly environment = environment;

  async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent
    });
    await modal.present();
    await modal.onWillDismiss();
    await this.pingService.restart();
  }

  private async showConnectionFailedModal(errorInformation: String) {
    const modal = await this.modalController.create({
      component: ConnectionFailedComponent,
      componentProps: {
        name: this.websocketService.getConnection()?.name,
        errorInformation: errorInformation
      }
    });
    await modal.present();
  }

  showDonateButton() {
    return !this.diagnosticsService.isiOS();
  }

  openDonate() {
    window.open("https://ko-fi.com/manuelmayer", "_blank");
  }
}
