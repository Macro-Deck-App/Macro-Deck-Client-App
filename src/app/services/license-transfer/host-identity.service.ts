import {Injectable} from '@angular/core';
import {HostHttpService} from "../host-http/host-http.service";
import {LegacyPurchase} from "./legacy-purchase.plugin";

export type HostIdentityState = "verified" | "locked" | "unsupported" | "unavailable" | "invalid";

export interface HostIdentityResult {
  state: HostIdentityState;
  fingerprint: string | null;
}

const identityTimeoutMs = 5000;

@Injectable({
  providedIn: 'root'
})
export class HostIdentityVerifier {
  public verify(publicKey: string, signature: string, message: string): Promise<{ valid: boolean, fingerprint: string }> {
    return LegacyPurchase.verifyHostIdentity({publicKey: publicKey, signature: signature, message: message});
  }
}

@Injectable({
  providedIn: 'root'
})
export class HostIdentityService {

  constructor(private hostHttp: HostHttpService,
              private verifier: HostIdentityVerifier) {
  }

  public async verify(baseUrl: string, requireEndpoint: boolean): Promise<HostIdentityResult> {
    const nonce = HostIdentityService.createNonce();
    const response = await this.hostHttp.postJson(`${baseUrl}/api/auth/identity`, {nonce: nonce}, identityTimeoutMs);
    if (response.status === 503 && response.data?.error === "KeyRingLocked") {
      return {state: "locked", fingerprint: null};
    }
    if (response.status === 0 || response.status === 429 || response.status >= 500) {
      return {state: "unavailable", fingerprint: null};
    }
    const answer = response.data;
    if (response.status !== 200 || typeof answer?.publicKey !== "string"
      || typeof answer?.signature !== "string" || typeof answer?.endpoint !== "string") {
      return {state: "unsupported", fingerprint: null};
    }
    if (requireEndpoint && !HostIdentityService.endpointMatches(baseUrl, answer.endpoint)) {
      return {state: "invalid", fingerprint: null};
    }

    try {
      const result = await this.verifier.verify(answer.publicKey, answer.signature,
        HostIdentityService.identityMessage(answer.publicKey, answer.endpoint, nonce));
      return result.valid ? {state: "verified", fingerprint: result.fingerprint} : {state: "invalid", fingerprint: null};
    } catch {
      return {state: "invalid", fingerprint: null};
    }
  }

  public static identityMessage(publicKey: string, endpoint: string, nonce: string): string {
    return `macrodeck-host-identity/v1\n${publicKey}\n${endpoint}\n${nonce}`;
  }

  // For IP literals from a connect link the signed socket address must be the dialed one (ADR 0086);
  // typed addresses are exempt because NAT and port forwards change what the host sees.
  public static endpointMatches(baseUrl: string, endpoint: string): boolean {
    const url = new URL(baseUrl);
    const isIpLiteral = /^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.startsWith("[");
    if (!isIpLiteral) {
      return true;
    }
    const port = url.port || (url.protocol === "https:" ? "443" : "80");
    return `${url.hostname}:${port}`.toLowerCase() === endpoint.toLowerCase();
  }

  private static createNonce(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...Array.from(bytes)));
  }
}
