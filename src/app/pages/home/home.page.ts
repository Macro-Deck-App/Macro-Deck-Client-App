import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal} from "@ionic/angular";
import {SettingsService} from "../../services/settings/settings.service";
import {environment} from "../../../environments/environment";
import {DiagnosticService} from "../../services/diagnostic/diagnostic.service";
import {Capacitor} from "@capacitor/core";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    clientId: string | undefined;
    selectedPage: string = "connections";
    splashScreen: boolean = true;
    splashScreenVisible: boolean = true;
    version: string | undefined;

    constructor(private settingsService: SettingsService,
                private diagnosticService: DiagnosticService) {
    }

    async ngOnInit() {
        this.clientId = await this.settingsService.getClientId();

        setTimeout(() => {
            this.splashScreenVisible = false;
            setTimeout(() => {
                this.splashScreen = false;
            }, 300);
        }, 1000);

        if (Capacitor.isNativePlatform()) {
            this.diagnosticService.getVersion().then(version => {
                this.version = `v${version}`;
            });
        } else {
            this.version = "Web Version";
        }
    }

    protected readonly environment = environment;
}
