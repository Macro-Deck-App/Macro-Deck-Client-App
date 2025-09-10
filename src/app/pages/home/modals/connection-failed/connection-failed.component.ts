import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-connection-failed',
  templateUrl: './connection-failed.component.html',
  styleUrls: ['./connection-failed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule],
})
export class ConnectionFailedComponent {
  name: string = '';
  errorInformation: string = '';

  constructor(private modalController: ModalController) {}

  async dismiss() {
    await this.modalController.dismiss();
  }
}
