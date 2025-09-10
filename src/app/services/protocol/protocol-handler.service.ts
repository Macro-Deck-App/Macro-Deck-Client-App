import { Injectable } from '@angular/core';
import { Protocol2Service } from './protocol2.service';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root',
})
export class ProtocolHandlerService {
  // Will be updated later
  protocolVersion: number = 2;

  constructor(private protocol2Service: Protocol2Service) {}

  async handleMessage(message: any) {
    switch (this.protocolVersion) {
      case 2:
        await this.protocol2Service.handleMessage(message);
        break;
    }
  }

  setWebsocketSubject(socket: WebSocketSubject<any>) {
    this.protocol2Service.setWebsocketSubject(socket);
  }
}
