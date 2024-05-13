import { Injectable } from '@angular/core';
import {Connection} from "../../datatypes/connection";
import {Storage} from '@ionic/storage';
import {SettingsService} from "../settings/settings.service";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionsStorageKey: string = "connections";

  constructor(private storage: Storage,
              private settingsService: SettingsService) { }

  public async getUsbConnection() {
    return {
      autoConnect: await this.settingsService.getUsbAutoConnect(),
      index: undefined,
      id: "usb",
      name: "USB",
      host: "127.0.0.1",
      port: await this.settingsService.getUsbPort(),
      ssl: await this.settingsService.getUsbUseSsl(),
      usbConnection: true,
      token: undefined
    }
  }

  public async getConnections(): Promise<Connection[]> {
    const connectionsData = await this.storage.get(this.connectionsStorageKey);
    if (connectionsData === undefined || connectionsData === null) {
      return [];
    }

    return JSON.parse(connectionsData).sort((a: Connection, b: Connection) => (a.index ?? 0) - (b.index ?? 0));
  }

  public async saveConnections(connections: Connection[]) {
    await this.storage.set(this.connectionsStorageKey, JSON.stringify(connections));
  }

  public async addUpdateConnection(connection: Connection) {
    const connectionsData = await this.storage.get(this.connectionsStorageKey);
    let connectionsObject = JSON.parse(connectionsData) ?? [];

    if (connection.id === undefined) {
      connection.id = `connection${Math.floor(Date.now() / 1000)}`;
      connection.index = connectionsObject.length;
      connectionsObject.push(connection);
    } else {
      const existingIndex = connectionsObject.findIndex((x: Connection) => x.id === connection.id);
      if (existingIndex > -1) {
        connectionsObject[existingIndex] = connection;
      } else {
        connectionsObject.push(connection);
      }
    }

    await this.saveConnections(connectionsObject);
  }

  public async deleteConnection(id: string) {
    const connectionsData = await this.storage.get(this.connectionsStorageKey);
    let connectionsObject:Connection[] = JSON.parse(connectionsData) ?? [];

    const existingIndex = connectionsObject.findIndex(x => x.id == id);
    if (existingIndex > -1) {
      connectionsObject.splice(existingIndex, 1);
    }

    await this.storage.set(this.connectionsStorageKey, JSON.stringify(connectionsObject));
  }
}
