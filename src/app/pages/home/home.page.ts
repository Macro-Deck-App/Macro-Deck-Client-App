import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {SettingsService} from "../../services/settings/settings.service";
import {environment} from "../../../environments/environment";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";
import {SettingsModalComponent} from "../shared/modals/settings-modal/settings-modal.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    clientId: string | undefined;
    version: string | undefined;

    constructor(private settingsService: SettingsService,
                private diagnosticService: DiagnosticService,
                private modalController: ModalController,
                private diagnosticsService: DiagnosticService) {
    }

    async ngOnInit() {
        this.clientId = await this.settingsService.getClientId();
        this.version = await this.diagnosticsService.getVersion();
    }

    protected readonly environment = environment;

  async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent
    });
    await modal.present();
  }

  showDonateButton() {
    return !this.diagnosticsService.isiOS();
  }

  openDonate() {
    window.open("https://ko-fi.com/manuelmayer", "_blank");
  }
}
