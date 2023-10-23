import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings/settings.service";
import {DOCUMENT} from "@angular/common";
import {ConnectionService} from "../../services/connection/connection.service";
import {ActivatedRoute} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {WebsocketService} from "../../services/websocket/websocket.service";
import {WakelockService} from "../../services/wakelock/wakelock.service";

@Component({
  selector: 'app-web-home',
  templateUrl: './web-home.page.html',
  styleUrls: ['./web-home.page.scss'],
})
export class WebHomePage implements OnInit {

  clientId: string | undefined;
  version: string | undefined;

  connectionLost: boolean = false;
  retryCountdown: number = 10;

  constructor(@Inject(DOCUMENT) private document: Document,
              private connectionService: ConnectionService,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private alertController: AlertController,
              private websocketService: WebsocketService,
              private wakeLockService: WakelockService,
              private settingsService: SettingsService) { }

  async ngOnInit() {
    this.clientId = await this.settingsService.getClientId();
    this.version = "Web Version";
    await this.connect();
    this.websocketService.connectionLost.subscribe(async () => {
      await this.lostConnection();
    });
  }

  async lostConnection() {
    this.connectionLost = true;
    this.retryCountdown = 10;
    let interval = setInterval(async () => {
      this.retryCountdown--;
      if (this.retryCountdown == 0) {
        clearInterval(interval);
        await this.connect();
      }
    }, 1000);
  }

  async connect() {
    this.connectionLost = false;
    const baseUrl = this.document.baseURI;
    const urlParts = baseUrl.split('/');
    const wsProtocol = urlParts[0].toLowerCase().replace('http', 'ws');
    const host = urlParts[2];
    const websocketUrl = `${wsProtocol}//${host}`;
    await this.websocketService.connectToString(websocketUrl);
  }

}
