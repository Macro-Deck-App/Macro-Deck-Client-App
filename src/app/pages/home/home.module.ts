import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import {WebHomePageModule} from "../web-home/web-home.module";
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {ConnectingComponent} from "./modals/connecting/connecting.component";
import {ConnectionFailedComponent} from "./modals/connection-failed/connection-failed.component";
import {ConnectionLostComponent} from "./modals/connection-lost/connection-lost.component";
import {InsecureConnectionComponent} from "./modals/insecure-connection/insecure-connection.component";
import {ScanNetworkInterfacesComponent} from "./modals/scan-network-interfaces/scan-network-interfaces.component";
import {QrCodeScannerComponent} from "./modals/add-connection/qr-code-scanner/qr-code-scanner.component";
import {
  QrCodeScannerUiComponent
} from "./modals/add-connection/qr-code-scanner/qr-code-scanner-ui/qr-code-scanner-ui.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WebHomePageModule,
        HomePage,
        AddConnectionComponent,
        ConnectingComponent,
        ConnectionFailedComponent,
        ConnectionLostComponent,
        InsecureConnectionComponent,
        ScanNetworkInterfacesComponent,
        QrCodeScannerComponent,
        QrCodeScannerUiComponent
    ]
})
export class HomePageModule {}
