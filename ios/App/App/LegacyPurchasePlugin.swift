import Capacitor
import CryptoKit
import StoreKit

@objc(LegacyPurchasePlugin)
public class LegacyPurchasePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LegacyPurchasePlugin"
    public let jsName = "LegacyPurchase"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getAppTransaction", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "verifyHostIdentity", returnType: CAPPluginReturnPromise)
    ]

    @objc func getAppTransaction(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.unavailable("AppTransaction requires iOS 16 or later")
            return
        }
        Task {
            do {
                let result = try await AppTransaction.shared
                call.resolve(["jws": result.jwsRepresentation])
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func verifyHostIdentity(_ call: CAPPluginCall) {
        guard let publicKey = Data(base64Encoded: call.getString("publicKey") ?? ""),
              let signature = Data(base64Encoded: call.getString("signature") ?? ""),
              let message = call.getString("message")?.data(using: .utf8),
              publicKey.count == 65, publicKey.first == 0x04,
              let key = try? P256.Signing.PublicKey(x963Representation: publicKey),
              let ecdsaSignature = try? P256.Signing.ECDSASignature(derRepresentation: signature) else {
            call.resolve(["valid": false, "fingerprint": ""])
            return
        }
        let hex = SHA256.hash(data: publicKey).prefix(12).map { String(format: "%02X", $0) }.joined()
        let fingerprint = stride(from: 0, to: hex.count, by: 4).map { offset -> String in
            let start = hex.index(hex.startIndex, offsetBy: offset)
            return String(hex[start..<hex.index(start, offsetBy: 4)])
        }.joined(separator: " ")
        call.resolve(["valid": key.isValidSignature(ecdsaSignature, for: message), "fingerprint": fingerprint])
    }
}
