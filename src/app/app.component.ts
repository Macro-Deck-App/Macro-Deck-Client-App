import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";
import {WakelockService} from "./services/wakelock/wakelock.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: Storage,
              private wakeLockService: WakelockService) {
  }

  async ngOnInit() {
    await this.storage.create();
    try {
      await this.wakeLockService.updateWakeLock();
    } catch {
      // exception is expected in browser because wake lock needs user interaction
    }
  }
}
