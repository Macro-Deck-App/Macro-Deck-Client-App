import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {KeepAwake} from "@capacitor-community/keep-awake";

const clientIdStorageKey: string = "client_id";
const wakeLockKey: string = "wake_lock_enabled";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  constructor(private storage: Storage) {
  }

  public async setWakeLockEnabled(state: boolean) {
    await this.storage.set(wakeLockKey, state);
  }

  public async getWakeLockEnabled() {
    return await this.storage.get(wakeLockKey) ?? false;
  }

  public async getClientId() {
    await this.generateClientId();
    return this.storage.get(clientIdStorageKey);
  }

  private async generateClientId() {
    let clientId = await this.storage.get(clientIdStorageKey);
    if (clientId?.length > 0) {
      return;
    }

    clientId = Math.random().toString(36).substring(2, 9);
    await this.storage.set(clientIdStorageKey, clientId);
  }
}
