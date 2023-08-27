import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private clientIdStorageKey: string = "client_id";

  constructor(private storage: Storage) {
  }

  public async getClientId() {
    await this.generateClientId();
    return this.storage.get(this.clientIdStorageKey);
  }

  private async generateClientId() {
    let clientId = await this.storage.get(this.clientIdStorageKey);
    if (clientId?.length > 0) {
      return;
    }

    clientId = Math.random().toString(36).substring(2, 9);
    await this.storage.set(this.clientIdStorageKey, clientId);
  }
}
