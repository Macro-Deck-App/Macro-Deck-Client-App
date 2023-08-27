import { Injectable } from '@angular/core';
import {App} from "@capacitor/app";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  constructor() { }

  async getVersion() {
    return await App.getInfo().then(info => info.version);
  }

}
