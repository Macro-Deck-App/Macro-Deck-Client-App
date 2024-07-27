import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT, NgIf} from "@angular/common";
import {WebsocketService} from "../../services/websocket/websocket.service";
import {SettingsService} from "../../services/settings/settings.service";
import { environment } from 'src/environments/environment';
import {IonicModule} from "@ionic/angular";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";

@Component({
  selector: 'app-car-thing-home',
  templateUrl: './car-thing-home.component.html',
  styleUrls: ['./car-thing-home.component.scss'],
  imports: [
    IonicModule,
    NgIf
  ],
  standalone: true
})
export class CarThingHomeComponent  implements OnInit {
  clientId: string | undefined;
  version: string | undefined;

  connectionLost: boolean = false;
  retryCountdown: number = 10;

  private interval: any;

  constructor(@Inject(DOCUMENT) private document: Document,
              private websocketService: WebsocketService,
              private settingsService: SettingsService,
              private diagnosticService: DiagnosticService) { }

  async ngOnInit() {
    this.clientId = await this.settingsService.getClientId();
    this.version = await this.diagnosticService.getVersion();
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
    const port = 8191;

    await this.websocketService.connectToLocalhost(false, port);
  }

  protected readonly environment = environment;
}
