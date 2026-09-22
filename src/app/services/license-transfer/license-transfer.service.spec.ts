import {LicenseTransferService} from "./license-transfer.service";

describe('LicenseTransferService', () => {
  const map = LicenseTransferService.mapResponse;

  it('treats transferred and already transferred as transferred', () => {
    expect(map({status: 200, data: {status: "transferred", code: null}}).state).toBe("transferred");
    expect(map({status: 200, data: {status: "alreadyTransferred", code: null}}).state).toBe("transferred");
  });

  it('keeps the code of pending and rejected answers', () => {
    expect(map({status: 200, data: {status: "pending", code: "store-unavailable"}}))
      .toEqual({state: "pending", code: "store-unavailable"});
    expect(map({status: 200, data: {status: "rejected", code: "purchase-before-paid-period"}}))
      .toEqual({state: "rejected", code: "purchase-before-paid-period"});
  });

  it('recognizes a locked host and rate limiting', () => {
    expect(map({status: 503, data: {error: "KeyRingLocked"}}).state).toBe("hostLocked");
    expect(map({status: 429, data: null}).state).toBe("rateLimited");
  });

  it('treats hosts without the endpoint as unsupported', () => {
    expect(map({status: 404, data: null}).state).toBe("hostUnsupported");
    expect(map({status: 405, data: null}).state).toBe("hostUnsupported");
    expect(map({status: 200, data: "<!doctype html>"}).state).toBe("hostUnsupported");
  });

  it('treats lost connections and server errors as failures', () => {
    expect(map({status: 0, data: null}).state).toBe("failed");
    expect(map({status: 500, data: null}).state).toBe("failed");
    expect(map({status: 503, data: {code: "store-unavailable"}}).state).toBe("failed");
  });

  it('explains purchases made while the app was free', () => {
    expect(LicenseTransferService.rejectionMessage("purchase-before-paid-period")).toContain("free");
    expect(LicenseTransferService.rejectionMessage("something-new")).toBe("The purchase could not be verified.");
  });
});
