import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone'; 

@Component({
  selector: 'app-insecure-connection',
  templateUrl: './insecure-connection.component.html',
  styleUrls: ['./insecure-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule],
})
export class InsecureConnectionComponent {
  constructor(private modalController: ModalController) {}

  async dismiss() {
    await this.modalController.dismiss();
  }
}
