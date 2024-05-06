import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, interval, mergeMap, Observable, of, retry, Subscription, switchMap, timeout} from "rxjs";
import {PingResponse} from "../../datatypes/ping-response";
import {ConnectionService} from "../connection/connection.service";
import {Connection} from "../../datatypes/connection";
import {SettingsService} from "../settings/settings.service";

@Injectable({
  providedIn: 'root'
})
export class PingService {
  public connectionAvailable: EventEmitter<Connection> = new EventEmitter();

  public connectionUnavailable: EventEmitter<Connection> = new EventEmitter();

  private subscription: Subscription = new Subscription();

  public availableConnections: string[] = [];

  public usbConnectionAvailable: boolean = false;

  constructor(private http: HttpClient,
              private connectionService: ConnectionService) { }

  async start() {
    this.subscription = new Subscription();

    let usbConnection: Connection = await this.connectionService.getUsbConnection();

    this.subscription.add(this.periodicRequest(this.getPingUrl(usbConnection), 1000).subscribe(response => {
      if (response !== null) {
        this.addAvailableConnection(usbConnection);
      } else {
        this.removeAvailableConnection(usbConnection);
      }
    }));

    let connections = await this.connectionService.getConnections();
    for (const connection of connections) {
      this.subscription.add(this.periodicRequest(this.getPingUrl(connection), 1500).subscribe(response => {
        if (response !== null) {
          this.addAvailableConnection(connection);
        } else {
          this.removeAvailableConnection(connection);
        }
      }));
    }
  }

  stop() {
    this.subscription.unsubscribe();
  }

  async restart() {
    this.stop();
    await this.start();
  }

  private getPingUrl(connection: Connection) {
    return `${connection.ssl ? "https" : "http"}://${connection.host}:${connection.port}/ping`;
  }

  private removeAvailableConnection(connection: Connection) {
    let existingConnectionIndex = this.availableConnections.findIndex(x => x == connection.id);
    if (existingConnectionIndex !== -1) {
      this.availableConnections.splice(existingConnectionIndex, 1);
      this.connectionUnavailable.emit(connection);
      if (connection.usbConnection) {
        this.usbConnectionAvailable = false;
      }
    }
  }

  private addAvailableConnection(connection: Connection) {
    if (this.availableConnections.find(x => x == connection.id)) {
      return;
    }
    if (connection.usbConnection) {
      this.usbConnectionAvailable = true;
    }
    this.availableConnections.push(connection.id);
    this.connectionAvailable.emit(connection);
  }

  private periodicRequest(url: string, intervalTime: number): Observable<any> {
    return interval(intervalTime).pipe(
      switchMap(() => this.http.get(url).pipe(
        timeout(800),
        catchError(error => {
          return of(null);
        })
      ))
    );
  }

}
