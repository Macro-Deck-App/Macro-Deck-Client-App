import {Injectable} from '@angular/core';
import {HostHttpService, HostHttpResponse} from "../host-http/host-http.service";
import {LegacyPurchase} from "./legacy-purchase.plugin";

export type LicenseTransferState =
  "transferred"
  | "pending"
  | "rejected"
  | "hostLocked"
  | "rateLimited"
  | "hostUnsupported"
  | "iosTooOld"
  | "purchaseUnavailable"
  | "failed";

export interface LicenseTransferResult {
  state: LicenseTransferState;
  code: string | null;
}

export const licenseTransferPath = "/api/legacy/md2-app/license-transfer";
const transferTimeoutMs = 15000;

@Injectable({
  providedIn: 'root'
})
export class LicenseTransferService {

  constructor(private hostHttp: HostHttpService) {
  }

  public async transfer(baseUrl: string): Promise<LicenseTransferResult> {
    let jws: string;
    try {
      jws = (await LegacyPurchase.getAppTransaction()).jws;
    } catch (error: any) {
      return {state: error?.code === "UNAVAILABLE" ? "iosTooOld" : "purchaseUnavailable", code: null};
    }

    const response = await this.hostHttp.postJson(`${baseUrl}${licenseTransferPath}`, {
      platform: "app-store-legacy",
      legacyKind: "appTransaction",
      signedPayload: jws
    }, transferTimeoutMs);

    return LicenseTransferService.mapResponse(response);
  }

  public static mapResponse(response: HostHttpResponse): LicenseTransferResult {
    const code = typeof response.data?.code === "string" ? response.data.code : null;
    if (response.status === 503 && response.data?.error === "KeyRingLocked") {
      return {state: "hostLocked", code: null};
    }
    if (response.status === 429) {
      return {state: "rateLimited", code: null};
    }
    if (response.status === 0 || response.status >= 500) {
      return {state: "failed", code: null};
    }
    if (response.status !== 200 || typeof response.data?.status !== "string") {
      return {state: "hostUnsupported", code: null};
    }
    switch (response.data.status) {
      case "transferred":
      case "alreadyTransferred":
        return {state: "transferred", code: null};
      case "pending":
        return {state: "pending", code: code};
      case "rejected":
        return {state: "rejected", code: code};
      default:
        return {state: "hostUnsupported", code: null};
    }
  }

  public static rejectionMessage(code: string | null): string {
    switch (code) {
      case "purchase-before-paid-period":
        return "This app was downloaded while it was still free, so there is no purchase to transfer.";
      case "purchase-refunded":
      case "purchase-revoked":
      case "license-revoked":
        return "The App Store reports this purchase as refunded or revoked.";
      case "sandbox-purchase":
        return "Test purchases cannot be transferred.";
      default:
        return "The purchase could not be verified.";
    }
  }
}
