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
    } else {
      const existingIndex = connectionsObject.findIndex((x: Connection) => x.id === connection.id);
      if (existingIndex > -1) {
        connectionsObject.splice(existingIndex, 1);
      }
    }

    connectionsObject.push(connection);
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
