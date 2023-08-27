import { Component, OnInit } from '@angular/core';
import {Connection} from "../../../datatypes/connection";
import {ConnectionService} from "../../../services/connection/connection.service";
import {AlertController, ModalController} from "@ionic/angular";
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {WebsocketService} from "../../../services/websocket/websocket.service";

@Component({
  selector: 'app-connections',
  templateUrl: './connections.page.html',
  styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

  discoveredConnections: Connection[] = [];
  savedConnections: Connection[] = [];
  savedConnectionsInitialized = false;

  constructor(private connectionService: ConnectionService,
              private modalController: ModalController,
              private alertController: AlertController,
              private websocketService: WebsocketService) { }

  async ngOnInit() {
    await this.loadConnections();
    this.savedConnectionsInitialized = true;
  }

  private async loadConnections() {
    this.savedConnections = await this.connectionService.getConnections() ?? [];
  }

  async openAddConnectionModal(existingConnection?: Connection | null) {
    const modal = await this.modalController.create({
      component: AddConnectionComponent,
      componentProps: {
        id: existingConnection?.id,
        name: existingConnection?.name,
        host: existingConnection?.host,
        port: existingConnection?.port ?? 8191,
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role !== 'confirm') {
      return;
    }

    await this.connectionService.addUpdateConnection(data);
    await this.loadConnections();
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
    await this.websocketService.connect(connection.host, connection.port, false);
  }
}
