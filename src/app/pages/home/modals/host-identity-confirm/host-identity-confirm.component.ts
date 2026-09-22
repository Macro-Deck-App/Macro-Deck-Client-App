import {Component, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {HostIdentityResult, HostIdentityService} from "../../../../services/license-transfer/host-identity.service";

@Component({
  selector: 'app-host-identity-confirm',
  templateUrl: './host-identity-confirm.component.html',
  styleUrls: ['./host-identity-confirm.component.scss'],
  imports: [
    IonicModule
  ]
})
export class HostIdentityConfirmComponent implements OnInit {

  baseUrl = "";
  hostName = "";
  expectedIdentityFingerprint: string | null = null;
  requireEndpoint = false;
  loading = true;
  result: HostIdentityResult | undefined;

  constructor(private modalController: ModalController,
              private hostIdentityService: HostIdentityService) {
  }

  async ngOnInit() {
    try {
      this.result = await this.hostIdentityService.verify(this.baseUrl, this.requireEndpoint);
    } catch {
      this.result = {state: "unavailable", fingerprint: null};
    } finally {
      this.loading = false;
    }
  }

  matchesQrCode(): boolean | null {
    if (!this.expectedIdentityFingerprint || !this.result?.fingerprint) {
      return null;
    }
    return this.expectedIdentityFingerprint === this.result.fingerprint;
  }

  canConfirm(): boolean {
    return this.result?.state === "verified" && this.matchesQrCode() !== false;
  }

  fingerprintRows(): string[] {
    const groups = this.result?.fingerprint?.split(" ") ?? [];
    return [groups.slice(0, 3).join(" "), groups.slice(3).join(" ")];
  }

  async confirm() {
    await this.modalController.dismiss(null, "confirm");
  }

  async cancel() {
    await this.modalController.dismiss(null, "cancel");
  }
}
