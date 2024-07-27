import {Component} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Router} from "@angular/router";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";
import {ModalController, ViewDidEnter, ViewDidLeave} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {SettingsService} from "../../services/settings/settings.service";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {NavigationDestination} from "../../enums/navigation-destination";
import {Subscription} from "rxjs";
import {MacroDeckService} from "../../services/macro-deck/macro-deck.service";
import {WidgetInteractionType} from "../../enums/widget-interaction-type";

@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements ViewDidEnter, ViewDidLeave {

  showMenuButton: boolean = true;
  clientId: string = "";
  version: string = "";

  private subscription: Subscription = new Subscription();

  constructor(private websocketService: WebsocketService,
              private modalController: ModalController,
              private settingsService: SettingsService,
              private diagnosticsService: DiagnosticService,
              private navigationService: NavigationService,
              private macroDeckService: MacroDeckService) {
  }

  ionViewDidLeave(): void {
    this.subscription.unsubscribe();
  }

  async ionViewDidEnter() {
    if (!this.websocketService.isConnected) {
      await this.navigationService.navigateTo(NavigationDestination.Home);
    }

    this.clientId = await this.settingsService.getClientId();
    this.version = await this.diagnosticsService.getVersion();
    await this.loadSettings();
    if (environment.carThing) {
      this.subscribeSpecialInteractions();
    }
  }

  private subscribeSpecialInteractions() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "1":
          break;
        case "2":
          break;
        case "3":
          break;
        case "4":
          break;
        case "m":
          break;
        case "Escape":
          break;
        case "Enter":
          break;
      }
    };

    document.onwheel = (wheelEvent: any) => {
      if (wheelEvent.wheelDeltaX > 0) {
      } else if (wheelEvent.wheelDeltaX < 0) {
      }
    }
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
