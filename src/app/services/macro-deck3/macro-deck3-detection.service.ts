import {Injectable} from '@angular/core';
import {HostHttpService} from "../host-http/host-http.service";
import {Connection} from "../../datatypes/connection";
import {ConnectLinkEndpoint} from "./connect-link";

export const macroDeck3DefaultPort = 8193;
const probeTimeoutMs = 2500;

type ProbeResult = "macroDeck3" | "otherHost" | "noAnswer";

@Injectable({
  providedIn: 'root'
})
export class MacroDeck3DetectionService {

  constructor(private hostHttp: HostHttpService) {
  }

  public async detect(connection: Connection): Promise<string | null> {
    const configuredUrl = MacroDeck3DetectionService.baseUrl(connection.host, connection.port, connection.ssl);
    const fallbackUrl = MacroDeck3DetectionService.baseUrl(connection.host, macroDeck3DefaultPort, false);
    const probeFallback = configuredUrl !== fallbackUrl;

    const [configured, fallback] = await Promise.all([
      this.probe(configuredUrl),
      probeFallback ? this.probe(fallbackUrl) : Promise.resolve<ProbeResult>("noAnswer")
    ]);

    if (configured === "macroDeck3") {
      return configuredUrl;
    }
    if (configured === "otherHost") {
      return null;
    }
    return fallback === "macroDeck3" ? fallbackUrl : null;
  }

  // A connect link always comes from a Macro Deck 3 host, so its first plain address is used when none answers yet.
  public async detectEndpoints(endpoints: ConnectLinkEndpoint[]): Promise<string | null> {
    const ordered = [...endpoints.filter(x => !x.ssl), ...endpoints.filter(x => x.ssl)];
    const urls = ordered.map(x => MacroDeck3DetectionService.baseUrl(x.address, x.port, x.ssl));
    const results = await Promise.all(urls.map(url => this.probe(url)));
    const index = results.indexOf("macroDeck3");
    return index === -1 ? urls[0] ?? null : urls[index];
  }

  private async probe(baseUrl: string): Promise<ProbeResult> {
    const response = await this.hostHttp.getJson(`${baseUrl}/api/auth/status`, probeTimeoutMs);
    if (response.status === 0) {
      return "noAnswer";
    }
    return MacroDeck3DetectionService.isAuthStatus(response.status, response.data) ? "macroDeck3" : "otherHost";
  }

  public static isAuthStatus(status: number, data: any): boolean {
    return status === 200 && data !== null && typeof data === "object" && typeof data.setupComplete === "boolean";
  }

  public static baseUrl(host: string, port: number, ssl: boolean): string {
    return `${ssl ? "https" : "http"}://${host}:${port}`;
  }
}
