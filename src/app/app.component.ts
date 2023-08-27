import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
  }
}
