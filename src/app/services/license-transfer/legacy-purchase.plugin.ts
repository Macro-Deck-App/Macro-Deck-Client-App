import {registerPlugin} from "@capacitor/core";

export interface LegacyPurchasePlugin {
  getAppTransaction(): Promise<{ jws: string }>;

  verifyHostIdentity(options: { publicKey: string, signature: string, message: string }): Promise<{ valid: boolean, fingerprint: string }>;
}

export const LegacyPurchase = registerPlugin<LegacyPurchasePlugin>("LegacyPurchase");
