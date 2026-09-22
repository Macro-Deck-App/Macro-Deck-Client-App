import {TestBed} from '@angular/core/testing';
import {HostIdentityService, HostIdentityVerifier} from "./host-identity.service";
import {HostHttpResponse, HostHttpService} from "../host-http/host-http.service";

const vector = {
  publicKey: "BF/LFTKcXP+NHq9gTqEqTI5T+YissLlEpv48Me1pYWcpoR7EyfEfZcxwi3NUqxwV7ggy3y5kH5ce6oMVrbK5wB4=",
  endpoint: "192.168.1.20:8193",
  nonce: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=",
  signature: "MEUCIBeCUvyqm/qv8MQFEvELRtOX3LVcfv6i12jnGPShq6r7AiEAucDDHXvryJyj5AXgokivIz5FKRaqqyRTObfndjqh/0A="
};

describe('HostIdentityService', () => {
  let response: HostHttpResponse;
  let signatureValid: boolean;
  let requestedUrl: string;
  let requestedBody: any;
  let service: HostIdentityService;

  beforeEach(() => {
    signatureValid = true;
    response = {status: 200, data: {publicKey: vector.publicKey, endpoint: vector.endpoint, signature: vector.signature}};
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HostHttpService, useValue: {
            postJson: async (url: string, body: any) => {
              requestedUrl = url;
              requestedBody = body;
              return response;
            }
          }
        },
        {
          provide: HostIdentityVerifier, useValue: {
            verify: async () => ({valid: signatureValid, fingerprint: "3208 E004 6ED3 EE6B 4E75 1027"})
          }
        }
      ]
    });
    service = TestBed.inject(HostIdentityService);
  });

  it('sends a 32 byte base64 nonce to the identity endpoint', async () => {
    await service.verify("http://192.168.1.20:8193", false);
    expect(requestedUrl).toBe("http://192.168.1.20:8193/api/auth/identity");
    expect(atob(requestedBody.nonce).length).toBe(32);
  });

  it('returns the fingerprint of a verified identity', async () => {
    expect(await service.verify("http://192.168.1.20:8193", true))
      .toEqual({state: "verified", fingerprint: "3208 E004 6ED3 EE6B 4E75 1027"});
  });

  it('rejects an invalid signature', async () => {
    signatureValid = false;
    expect((await service.verify("http://192.168.1.20:8193", false)).state).toBe("invalid");
  });

  it('rejects a connect link address the host did not answer on', async () => {
    expect((await service.verify("http://192.168.1.99:8193", true)).state).toBe("invalid");
  });

  it('accepts a typed address behind NAT', async () => {
    expect((await service.verify("http://203.0.113.5:18193", false)).state).toBe("verified");
  });

  it('reports a locked host', async () => {
    response = {status: 503, data: {error: "KeyRingLocked"}};
    expect((await service.verify("http://192.168.1.20:8193", false)).state).toBe("locked");
  });

  it('reports unreachable and rate limited hosts as unavailable', async () => {
    for (const status of [0, 429, 503]) {
      response = {status: status, data: null};
      expect((await service.verify("http://192.168.1.20:8193", false)).state).toBe("unavailable");
    }
  });

  it('reports hosts without the identity endpoint as unsupported', async () => {
    for (const answer of [{status: 404, data: null}, {status: 200, data: "<!doctype html>"}]) {
      response = answer;
      expect((await service.verify("http://192.168.1.20:8193", false)).state).toBe("unsupported");
    }
  });

  it('builds the identity message of the shared host identity vector', () => {
    expect(HostIdentityService.identityMessage(vector.publicKey, vector.endpoint, vector.nonce))
      .toBe(`macrodeck-host-identity/v1\n${vector.publicKey}\n${vector.endpoint}\n${vector.nonce}`);
  });

  it('compares connect link endpoints including default ports', () => {
    expect(HostIdentityService.endpointMatches("http://192.168.1.20:8193", "192.168.1.20:8193")).toBeTrue();
    expect(HostIdentityService.endpointMatches("http://192.168.1.20:8193", "192.168.1.99:8193")).toBeFalse();
    expect(HostIdentityService.endpointMatches("http://192.168.1.20:80", "192.168.1.20:80")).toBeTrue();
    expect(HostIdentityService.endpointMatches("https://192.168.1.20", "192.168.1.20:443")).toBeTrue();
    expect(HostIdentityService.endpointMatches("http://[fe80::1]:8193", "[fe80::1]:8193")).toBeTrue();
    expect(HostIdentityService.endpointMatches("http://gaming-pc.local:8193", "192.168.1.20:8193")).toBeTrue();
  });
});
