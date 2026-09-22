import {Component, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {DiagnosticService} from "../../../../services/diagnostic/diagnostic.service";
import {
  LicenseTransferResult,
  LicenseTransferService
} from "../../../../services/license-transfer/license-transfer.service";
import {HostIdentityConfirmComponent} from "../host-identity-confirm/host-identity-confirm.component";
import {companionAppUrl} from "../../../../services/macro-deck3/companion-app-url";


@Component({
  selector: 'app-macro-deck3-detected',
  templateUrl: './macro-deck3-detected.component.html',
  imports: [
    IonicModule
  ]
})
export class MacroDeck3DetectedComponent implements OnInit {

  baseUrl: string | null = null;
  name: string | undefined;
  expectedIdentityFingerprint: string | null = null;
  fromConnectLink = false;
  transferEnabled = false;
  transferring = false;
  result: LicenseTransferResult | undefined;
  hostName = "";

  constructor(private modalController: ModalController,
              private diagnosticService: DiagnosticService,
              private licenseTransferService: LicenseTransferService) {
  }

  ngOnInit() {
    this.transferEnabled = this.diagnosticService.isiOS() && this.baseUrl !== null;
    this.hostName = this.name || (this.baseUrl ? new URL(this.baseUrl).host : "");
  }

  canTransfer() {
    return this.transferEnabled && !this.transferring
      && (this.result === undefined || !["transferred", "pending", "rejected", "hostUnsupported", "iosTooOld"].includes(this.result.state));
  }

  async transfer() {
    if (!this.transferEnabled || this.transferring) {
      return;
    }
    this.transferring = true;
    if (!await this.confirmIdentity()) {
      this.transferring = false;
      return;
    }
    try {
      this.result = await this.licenseTransferService.transfer(this.baseUrl!);
    } catch {
      this.result = {state: "failed", code: null};
    } finally {
      this.transferring = false;
    }
  }

  async confirmIdentity(): Promise<boolean> {
    const modal = await this.modalController.create({
      component: HostIdentityConfirmComponent,
      componentProps: {
        baseUrl: this.baseUrl,
        hostName: this.hostName,
        expectedIdentityFingerprint: this.expectedIdentityFingerprint,
        requireEndpoint: this.fromConnectLink
      }
    });
    await modal.present();
    const {role} = await modal.onWillDismiss();
    return role === "confirm";
  }

  rejectionMessage() {
    return LicenseTransferService.rejectionMessage(this.result?.code ?? null);
  }

  openCompanionApp() {
    window.open(companionAppUrl, "_blank");
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
