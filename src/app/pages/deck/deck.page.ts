import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Router} from "@angular/router";
import {CurrentPlatformService} from "../../services/current-platform/current-platform.service";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";
import {ModalController} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {SettingsService} from "../../services/settings/settings.service";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";

@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements AfterViewInit {

  showMenuButton: boolean = true;
  clientId: string = "";
  version: string = "";

  constructor(private websocketService: WebsocketService,
              private router: Router,
              private modalController: ModalController,
              private settingsService: SettingsService,
              private diagnosticsService: DiagnosticService) {
  }

  async ngAfterViewInit() {
    if (!this.websocketService.isConnected) {
      await this.router.navigate([''], {replaceUrl: true});
    }

    this.clientId = await this.settingsService.getClientId();
    this.version = await this.diagnosticsService.getVersion();
    await this.loadSettings();
  }

  async close() {
    this.websocketService.close();
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent
    });
    await modal.present();
    await modal.onWillDismiss();
    await this.loadSettings();
  }

  openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then();
    }
  }

  private async loadSettings() {
    this.showMenuButton = await this.settingsService.getShowMenuButton();
  }

  protected readonly environment = environment;
}
