import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Router} from "@angular/router";
import {CurrentPlatformService} from "../../services/current-platform/current-platform.service";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";
import {ModalController} from "@ionic/angular";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements OnInit, AfterViewInit {

  showFullscreenButton: boolean = true;

  constructor(private websocketService: WebsocketService,
              private router: Router,
              private currentPlatformService: CurrentPlatformService,
              private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.showFullscreenButton = this.currentPlatformService.isBrowser();
  }

  async ngAfterViewInit() {
    if (!this.websocketService.isConnected) {
      await this.router.navigate([''], {replaceUrl: true});
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
  }

  openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then();
    }
  }

  protected readonly environment = environment;
}
