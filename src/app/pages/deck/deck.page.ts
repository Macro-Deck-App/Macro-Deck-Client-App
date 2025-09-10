import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";
import {IonicModule, ModalController, ViewDidEnter, ViewDidLeave} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {SettingsService} from "../../services/settings/settings.service";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {NavigationDestination} from "../../enums/navigation-destination";
import {WidgetGridComponent} from "./widget-grid/widget-grid.component";


@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule,
    WidgetGridComponent
  ]
})
export class DeckPage implements ViewDidEnter {

  showMenuButton: boolean = true;
  clientId: string = "";
  version: string = "";

  constructor(private websocketService: WebsocketService,
              private modalController: ModalController,
              private settingsService: SettingsService,
              private diagnosticsService: DiagnosticService,
              private navigationService: NavigationService) {
  }

  async ionViewDidEnter() {
    if (!this.websocketService.isConnected) {
      await this.navigationService.navigateTo(NavigationDestination.Home);
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
