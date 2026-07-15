import {Injectable} from '@angular/core';
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Capacitor} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class HapticService {
  /**
   * Short tap feedback for normal button presses.
   */
  async lightImpact() {
    await this.play(ImpactStyle.Medium, 35);
  }

  /**
   * Stronger feedback for long-press / secondary actions.
   */
  async mediumImpact() {
    await this.play(ImpactStyle.Heavy, 55);
  }

  private async play(style: ImpactStyle, vibrateMs: number) {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // vibrate() is the most reliable on Android devices.
      await Haptics.vibrate({duration: vibrateMs});
    } catch {
      try {
        await Haptics.impact({style});
      } catch {
        // Haptics unavailable on this device.
      }
    }
  }
}
