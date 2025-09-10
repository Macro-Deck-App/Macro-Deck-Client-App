import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ScreenOrientationType } from '../../enums/screen-orientation-type';
import { AppearanceType } from '../../enums/appearance-type';
import { ButtonWidgetBorderStyle } from '../../widget-content-components/button-widget/button-widget-border-style';

const clientIdStorageKey: string = 'client_id';
const wakeLockKey: string = 'wake_lock_enabled';
const buttonLongPressDelay: string = 'button_long_press_delay';
const screenOrientationKey: string = 'screen_orientation';
const connectionCountKey: string = 'connection_count';
const lastConnectionKey: string = 'last_connection';
const skipSslValidationKey: string = 'skip_ssl_validation';
const showMenuButtonKey: string = 'show_menu_button';
const appearanceKey: string = 'appearance';
const usbAutoConnectKey: string = 'usb_auto_connect';
const usbPortKey: string = 'usb_port';
const usbUseSslKey: string = 'usb_use_ssl';
const buttonWidgetBorderStyleKey: string = 'button_widget_border_style';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private storage: Storage) {}

  public async setButtonWidgetBorderStyle(style: ButtonWidgetBorderStyle) {
    await this.storage.set(buttonWidgetBorderStyleKey, style);
  }

  public async getButtonWidgetBorderStyle() {
    return (
      (await this.storage.get(buttonWidgetBorderStyleKey)) ??
      ButtonWidgetBorderStyle.None
    );
  }

  public async setUsbUseSsl(useSsl: boolean) {
    await this.storage.set(usbUseSslKey, useSsl);
  }

  public async getUsbUseSsl() {
    return (await this.storage.get(usbUseSslKey)) ?? false;
  }

  public async setUsbPort(usbPort: number) {
    await this.storage.set(usbPortKey, usbPort);
  }

  public async getUsbPort() {
    return (await this.storage.get(usbPortKey)) ?? 8191;
  }

  public async setUsbAutoConnect(usbAutoConnect: boolean) {
    await this.storage.set(usbAutoConnectKey, usbAutoConnect);
  }

  public async getUsbAutoConnect() {
    return (await this.storage.get(usbAutoConnectKey)) ?? false;
  }

  public async setAppearance(appearanceType: AppearanceType) {
    await this.storage.set(appearanceKey, appearanceType);
  }

  public async getAppearance() {
    return (await this.storage.get(appearanceKey)) ?? AppearanceType.Dark;
  }

  public async setShowMenuButton(showMenuButton: boolean) {
    await this.storage.set(showMenuButtonKey, showMenuButton);
  }

  public async getShowMenuButton() {
    return (await this.storage.get(showMenuButtonKey)) ?? true;
  }

  public async setSkipSslValidation(lastConnection: boolean) {
    await this.storage.set(skipSslValidationKey, lastConnection);
  }

  public async getSkipSslValidation() {
    return (await this.storage.get(skipSslValidationKey)) ?? false;
  }

  public async setLastConnection(lastConnection: String) {
    await this.storage.set(lastConnectionKey, lastConnection);
  }

  public async getLastConnection() {
    return await this.storage.get(lastConnectionKey);
  }

  public async setScreenOrientation(screenOrientation: ScreenOrientationType) {
    await this.storage.set(screenOrientationKey, screenOrientation);
  }

  public async getScreenOrientation() {
    return (
      (await this.storage.get(screenOrientationKey)) ??
      ScreenOrientationType.Auto
    );
  }

  public async setButtonLongPressDelay(delay: number) {
    await this.storage.set(buttonLongPressDelay, delay);
  }

  public async getButtonLongPressDelay() {
    return (await this.storage.get(buttonLongPressDelay)) ?? 1000;
  }

  public async setWakeLockEnabled(state: boolean) {
    await this.storage.set(wakeLockKey, state);
  }

  public async getWakeLockEnabled() {
    return (await this.storage.get(wakeLockKey)) ?? false;
  }

  public async getConnectionCount() {
    return (await this.storage.get(connectionCountKey)) ?? 0;
  }

  public async increaseConnectionCount() {
    let connectionCount = await this.getConnectionCount();
    await this.storage.set(connectionCountKey, connectionCount + 1);
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
