import { Injectable } from '@angular/core';
import {Connection} from "../../datatypes/connection";
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionsStorageKey: string = "connections";

  constructor(private storage: Storage) { }

  public async getConnections(): Promise<Connection[]> {
    const connectionsData = await this.storage.get(this.connectionsStorageKey);
    if (connectionsData === undefined) {
      return [];
    }
    return JSON.parse(connectionsData);
  }

  public async addUpdateConnection(connection: Connection) {
    const connectionsData = await this.storage.get(this.connectionsStorageKey);
    let connectionsObject = JSON.parse(connectionsData) ?? [];

    console.log(connection);

    if (connection.id === undefined) {
      connection.id = `connection${Math.floor(Date.now() / 1000)}`;
    } else {
      const existingIndex = connectionsObject.findIndex((x: Connection) => x.id === connection.id);
      if (existingIndex > -1) {
        connectionsObject.splice(existingIndex, 1);
      }
    }

    connectionsObject.push(connection);
    console.log(connectionsObject);
    await this.storage.set(this.connectionsStorageKey, JSON.stringify(connectionsObject));
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
