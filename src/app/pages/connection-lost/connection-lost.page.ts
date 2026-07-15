import {Component} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Connection} from "../../datatypes/connection";
import {Subscription} from "rxjs";
import {NavigationService} from "../../services/navigation/navigation.service";
import {NavigationDestination} from "../../enums/navigation-destination";
import {IonicModule, ViewDidEnter, ViewDidLeave} from "@ionic/angular";
import {WakelockService} from "../../services/wakelock/wakelock.service";

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.page.html',
  styleUrls: ['./connection-lost.page.scss'],
  imports: [
    IonicModule
  ]
})
export class ConnectionLostPage implements ViewDidEnter, ViewDidLeave {

  retryCountdown: number = 10;

  connection: Connection | undefined;

  private subscription: Subscription = new Subscription();

  private interval: any;

  constructor(private websocketService: WebsocketService,
              private navigationService: NavigationService,
              private wakelockService: WakelockService) {
    this.connection = websocketService.getConnection();
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }

  async ionViewDidEnter() {
    // Let the phone's normal screen timeout kick in while disconnected.
    await this.wakelockService.onConnectionLost();

    this.subscription.add(this.websocketService.connectionFailed.subscribe(() => {
      this.startRetry();
    }));
    this.subscription.add(this.websocketService.connected.subscribe(async () => {
      await this.wakelockService.onConnected();
    }));
    await this.startRetry();
  }

  async startRetry() {
    clearInterval(this.interval);
    this.retryCountdown = 10;
    this.interval = setInterval(async () => {
      this.retryCountdown--;
      if (this.retryCountdown == 0) {
        await this.connect();
      }
    }, 1000);
  }

  async connect() {
    clearInterval(this.interval);
    if (this.connection == undefined) {
      await this.navigationService.navigateTo(NavigationDestination.Home);
      return;
    }
    await this.websocketService.connectToConnection(this.connection);
  }

  async cancel() {
    clearInterval(this.interval);
    await this.wakelockService.onConnected();
    await this.navigationService.navigateTo(NavigationDestination.Home);
  }
}
