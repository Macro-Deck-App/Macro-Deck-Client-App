import {TestBed} from '@angular/core/testing';
import {MacroDeck3DetectionService} from "./macro-deck3-detection.service";
import {HostHttpResponse, HostHttpService} from "../host-http/host-http.service";
import {Connection} from "../../datatypes/connection";

const md3Status: HostHttpResponse = {
  status: 200,
  data: {setupComplete: true, authenticated: false, trusted: false, scope: null, username: null}
};
const noAnswer: HostHttpResponse = {status: 0, data: null};

class FakeHostHttp {
  responses: { [url: string]: HostHttpResponse } = {};
  requested: string[] = [];

  async getJson(url: string): Promise<HostHttpResponse> {
    this.requested.push(url);
    return this.responses[url] ?? noAnswer;
  }
}

function connection(port: number, ssl = false): Connection {
  return {
    id: "1", name: "PC", host: "192.168.1.10", port: port, ssl: ssl,
    index: 0, autoConnect: false, usbConnection: false, token: undefined
  };
}

describe('MacroDeck3DetectionService', () => {
  let service: MacroDeck3DetectionService;
  let http: FakeHostHttp;

  beforeEach(() => {
    http = new FakeHostHttp();
    TestBed.configureTestingModule({providers: [{provide: HostHttpService, useValue: http}]});
    service = TestBed.inject(MacroDeck3DetectionService);
  });

  it('detects Macro Deck 3 on the configured port', async () => {
    http.responses["http://192.168.1.10:8193/api/auth/status"] = md3Status;
    expect(await service.detect(connection(8193))).toBe("http://192.168.1.10:8193");
  });

  it('detects Macro Deck 3 on the default port when the configured port does not answer', async () => {
    http.responses["http://192.168.1.10:8193/api/auth/status"] = md3Status;
    expect(await service.detect(connection(8191))).toBe("http://192.168.1.10:8193");
  });

  it('probes the default port over plain http even for ssl connections', async () => {
    http.responses["http://192.168.1.10:8193/api/auth/status"] = md3Status;
    expect(await service.detect(connection(8191, true))).toBe("http://192.168.1.10:8193");
    expect(http.requested).toContain("https://192.168.1.10:8191/api/auth/status");
  });

  it('ignores the default port when another host answers on the configured port', async () => {
    http.responses["http://192.168.1.10:8191/api/auth/status"] = {status: 404, data: "Not found"};
    http.responses["http://192.168.1.10:8193/api/auth/status"] = md3Status;
    expect(await service.detect(connection(8191))).toBeNull();
  });

  it('does not detect Macro Deck 2 style answers', async () => {
    for (const answer of [
      {status: 404, data: null},
      {status: 200, data: "<!doctype html><html></html>"},
      {status: 200, data: {status: "ok"}},
      {status: 200, data: {setupComplete: "yes"}}
    ]) {
      http.responses["http://192.168.1.10:8193/api/auth/status"] = answer;
      expect(await service.detect(connection(8193))).toBeNull();
    }
  });

  it('returns null when nothing answers', async () => {
    expect(await service.detect(connection(8191))).toBeNull();
  });

  it('falls back to the first plain endpoint of a connect link when none answers', async () => {
    expect(await service.detectEndpoints([
      {address: "192.168.1.10", port: 8194, ssl: true},
      {address: "192.168.1.10", port: 8193, ssl: false}
    ])).toBe("http://192.168.1.10:8193");
  });

  it('returns null for a connect link without endpoints', async () => {
    expect(await service.detectEndpoints([])).toBeNull();
  });

  it('prefers plain endpoints from a connect link', async () => {
    http.responses["http://192.168.1.10:8193/api/auth/status"] = md3Status;
    http.responses["https://192.168.1.10:8194/api/auth/status"] = md3Status;
    expect(await service.detectEndpoints([
      {address: "192.168.1.10", port: 8194, ssl: true},
      {address: "192.168.1.10", port: 8193, ssl: false}
    ])).toBe("http://192.168.1.10:8193");
  });
});
