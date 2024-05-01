import {AfterContentInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Connection} from "../../../datatypes/connection";
import {ConnectionService} from "../../../services/connection/connection.service";
import {AlertController, ItemReorderEventDetail, ModalController} from "@ionic/angular";
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {WebsocketService} from "../../../services/websocket/websocket.service";
import {WakelockService} from "../../../services/wakelock/wakelock.service";
import {SettingsService} from "../../../services/settings/settings.service";
import {PingService} from "../../../services/ping/ping.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-connections',
  templateUrl: './connections.page.html',
  styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  savedConnections: Connection[] = [];
  availableConnections: string[] = [];
  savedConnectionsInitialized = false;
  reorderEnabled: boolean = true;

  constructor(private connectionService: ConnectionService,
              private modalController: ModalController,
              private alertController: AlertController,
              private websocketService: WebsocketService,
              private wakeLockService: WakelockService,
              private settingsService: SettingsService,
              private pingService: PingService) { }

  async ngOnInit() {
    await this.loadConnections();
    await this.pingService.start();
    this.subscription.add(this.pingService.connectionAvailable.subscribe(async connectionId=> {
      if (!this.availableConnections.includes(connectionId)) {
        this.availableConnections.push(connectionId);
        let connection = this.savedConnections.find(x => x.id == connectionId);
        if (connection?.autoConnect === true) {
          await this.connect(connection);
        }
      }
    }));
    this.subscription.add(this.pingService.connectionUnavailable.subscribe(connectionId=> {
      if (this.availableConnections.includes(connectionId)) {
        this.availableConnections.splice(this.availableConnections.indexOf(connectionId), 1);
      }
    }));
    this.subscription.add(this.websocketService.connected.subscribe(_ => {
      this.pingService.stop();
    }));
    this.subscription.add(this.websocketService.closed.subscribe(_ => {
      this.pingService.start();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async loadConnections() {
    this.savedConnections = await this.connectionService.getConnections() ?? [];
    this.savedConnectionsInitialized = true;
  }

  async openAddConnectionModal(existingConnection?: Connection | null) {
    const modal = await this.modalController.create({
      component: AddConnectionComponent,
      componentProps: {
        id: existingConnection?.id,
        name: existingConnection?.name,
        host: existingConnection?.host,
        port: existingConnection?.port ?? 8191,
        useSsl: existingConnection?.ssl ?? false,
        autoConnect: existingConnection?.autoConnect ?? false,
        index: existingConnection?.index ?? 0,
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role !== 'confirm') {
      return;
    }

    await this.connectionService.addUpdateConnection(data);
    await this.loadConnections();
    await this.pingService.restart();
  }

  async handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
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
    await this.websocketService.connect(connection.host, connection.port, connection.ssl, connection.id);
  }
}
