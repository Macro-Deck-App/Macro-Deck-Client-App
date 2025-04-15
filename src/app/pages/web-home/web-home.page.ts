import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings/settings.service";
import { DOCUMENT } from "@angular/common";
import {WebsocketService} from "../../services/websocket/websocket.service";
import {environment} from "../../../environments/environment";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-web-home',
  templateUrl: './web-home.page.html',
  styleUrls: ['./web-home.page.scss'],
  imports: [
    IonicModule
]
})
export class WebHomePage implements OnInit {

  clientId: string | undefined;
  version: string | undefined;

  connectionLost: boolean = false;
  retryCountdown: number = 10;

  private interval: any;

  constructor(@Inject(DOCUMENT) private document: Document,
              private websocketService: WebsocketService,
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
    this.interval = setInterval(async () => {
      this.retryCountdown--;
      if (this.retryCountdown == 0) {
        await this.connect();
      }
    }, 1000);
  }

  async connect() {
    clearInterval(this.interval);
    this.connectionLost = false;
    const baseUrl = this.document.baseURI;
    const urlParts = baseUrl.split('/');
    const wsProtocol = urlParts[0].toLowerCase().replace('http', 'ws');
    const host = urlParts[2];
    const websocketUrl = `${wsProtocol}//${host}`;

    await this.websocketService.connectToString(websocketUrl);
  }

  protected readonly environment = environment;
}
