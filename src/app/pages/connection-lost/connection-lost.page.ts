import {Component, inject} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Connection} from "../../datatypes/connection";
import {Subscription} from "rxjs";
import {IonicModule, ViewDidEnter, ViewDidLeave} from "@ionic/angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.page.html',
  styleUrls: ['./connection-lost.page.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class ConnectionLostPage implements ViewDidEnter, ViewDidLeave {

  retryCountdown: number = 10;
  connection: Connection | undefined;

  private readonly router = inject(Router);
  private subscription: Subscription = new Subscription();
  private interval: any;

  constructor(private websocketService: WebsocketService) {
    this.connection = websocketService.getConnection();
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  async ionViewDidEnter() {
    this.subscription.add(this.websocketService.connectionFailed.subscribe(() => {
      this.startRetry();
    }));
    await this.startRetry();
  }

  async startRetry() {
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
      this.router.navigate([''])
      return;
    }
    await this.websocketService.connectToConnection(this.connection);
  }

  async cancel() {
    clearInterval(this.interval);
    this.router.navigate([''])
  }
}
