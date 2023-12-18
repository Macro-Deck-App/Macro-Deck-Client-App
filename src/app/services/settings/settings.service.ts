import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

const clientIdStorageKey: string = "client_id";
const wakeLockKey: string = "wake_lock_enabled";
const buttonLongPressDelay: string = "button_long_press_delay";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  constructor(private storage: Storage) {
  }

  public async setButtonLongPressDelay(delay: number) {
    await this.storage.set(buttonLongPressDelay, delay);
  }

  public async getButtonLongPressDelay() {
    return await this.storage.get(buttonLongPressDelay) ?? 1000;
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
