import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, interval, mergeMap, Observable, of, retry, Subscription, switchMap, timeout} from "rxjs";
import {PingResponse} from "../../datatypes/ping-response";
import {ConnectionService} from "../connection/connection.service";
import {Connection} from "../../datatypes/connection";

@Injectable({
  providedIn: 'root'
})
export class PingService {
  public connectionAvailable: EventEmitter<string> = new EventEmitter();

  public connectionUnavailable: EventEmitter<string> = new EventEmitter();

  private subscription: Subscription = new Subscription();

  private availableConnections: string[] = [];

  constructor(private http: HttpClient,
              private connectionService: ConnectionService) { }

  async start() {
    console.log("Start ping");
    this.subscription = new Subscription();
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
    console.log("Stop ping");
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
      this.connectionUnavailable.emit(connection.id);
    }
  }

  private addAvailableConnection(connection: Connection) {
    if (this.availableConnections.find(x => x == connection.id)) {
      return;
    }
    this.availableConnections.push(connection.id);
    this.connectionAvailable.emit(connection.id);
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
