import {Injectable} from '@angular/core';
import {CapacitorHttp} from "@capacitor/core";

export interface HostHttpResponse {
  status: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class HostHttpService {

  public async getJson(url: string, timeoutMs: number): Promise<HostHttpResponse> {
    return this.request({url: url, method: "GET"}, timeoutMs);
  }

  public async postJson(url: string, body: any, timeoutMs: number): Promise<HostHttpResponse> {
    return this.request({
      url: url,
      method: "POST",
      headers: {"Content-Type": "application/json"},
      data: body
    }, timeoutMs);
  }

  private async request(options: { url: string, method: string, headers?: any, data?: any }, timeoutMs: number): Promise<HostHttpResponse> {
    const failed: HostHttpResponse = {status: 0, data: null};
    let timer: any;
    const timeout = new Promise<HostHttpResponse>(resolve => timer = setTimeout(() => resolve(failed), timeoutMs));
    const request = CapacitorHttp.request({
      ...options,
      connectTimeout: timeoutMs,
      readTimeout: timeoutMs
    }).then(response => ({status: response.status, data: HostHttpService.parseBody(response.data)}), () => failed);
    try {
      return await Promise.race([request, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  public static parseBody(data: any): any {
    if (typeof data !== "string") {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
}
