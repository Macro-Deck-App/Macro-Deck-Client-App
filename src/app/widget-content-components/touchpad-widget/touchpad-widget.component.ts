import {Component} from '@angular/core';
import {Widget} from "../../datatypes/widgets/widget";
import {WidgetGridComponent} from "../../pages/deck/widget-grid/widget-grid.component";
import {Protocol2Service} from "../../services/protocol/protocol2.service";
import {HapticService} from "../../services/haptic/haptic.service";

@Component({
  selector: 'app-touchpad-widget',
  templateUrl: './touchpad-widget.component.html',
  styleUrls: ['./touchpad-widget.component.scss'],
  standalone: true
})
export class TouchpadWidgetComponent {
  protected readonly widgetGridComponent = WidgetGridComponent;

  widget: Widget | undefined;

  private readonly moveScale = 1.75;
  private readonly tapSlopPx = 8;
  private readonly scrollScale = 3;

  private activePointerId: number | null = null;
  private lastX = 0;
  private lastY = 0;
  private startX = 0;
  private startY = 0;
  private moved = false;
  private isTwoFingerScroll = false;
  private lastScrollY = 0;
  private scrollAccumulator = 0;

  constructor(private protocol2Service: Protocol2Service,
              private hapticService: HapticService) {
  }

  updateWidget(widget: Widget) {
    this.widget = widget;
  }

  onSurfacePointerDown(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;

    if (event.isPrimary && this.activePointerId === null) {
      this.activePointerId = event.pointerId;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.moved = false;
      this.isTwoFingerScroll = false;
      this.scrollAccumulator = 0;
      target.setPointerCapture(event.pointerId);
      return;
    }

    // Second finger starts scroll mode.
    if (!event.isPrimary && this.activePointerId !== null) {
      this.isTwoFingerScroll = true;
      this.lastScrollY = event.clientY;
      this.moved = true;
    }
  }

  onSurfacePointerMove(event: PointerEvent) {
    if (this.isTwoFingerScroll) {
      if (event.pointerId === this.activePointerId) {
        return;
      }

      const deltaY = this.lastScrollY - event.clientY;
      this.lastScrollY = event.clientY;
      this.scrollAccumulator += deltaY * this.scrollScale;

      while (Math.abs(this.scrollAccumulator) >= 120) {
        const notch = this.scrollAccumulator > 0 ? 120 : -120;
        this.protocol2Service.sendMouseScroll(notch);
        this.scrollAccumulator -= notch;
      }
      return;
    }

    if (event.pointerId !== this.activePointerId) {
      return;
    }

    const rawDx = event.clientX - this.lastX;
    const rawDy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    const totalDx = event.clientX - this.startX;
    const totalDy = event.clientY - this.startY;
    if (Math.hypot(totalDx, totalDy) > this.tapSlopPx) {
      this.moved = true;
    }

    const deltaX = Math.round(rawDx * this.moveScale);
    const deltaY = Math.round(rawDy * this.moveScale);
    this.protocol2Service.sendTouchpadMove(deltaX, deltaY);
  }

  onSurfacePointerUp(event: PointerEvent) {
    if (event.pointerId !== this.activePointerId && !this.isTwoFingerScroll) {
      return;
    }

    const wasTap = !this.moved && !this.isTwoFingerScroll && event.pointerId === this.activePointerId;
    if (event.pointerId === this.activePointerId) {
      this.activePointerId = null;
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
      } catch {
        // Pointer may already be released.
      }
    }

    if (wasTap) {
      void this.hapticService.lightImpact();
      this.protocol2Service.sendMouseClick("LEFT");
    }

    if (this.activePointerId === null) {
      this.isTwoFingerScroll = false;
      this.scrollAccumulator = 0;
    }
  }

  onSurfacePointerCancel(event: PointerEvent) {
    if (event.pointerId === this.activePointerId) {
      this.activePointerId = null;
      this.isTwoFingerScroll = false;
      this.moved = false;
      this.scrollAccumulator = 0;
    }
  }

  onLeftClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    void this.hapticService.lightImpact();
    this.protocol2Service.sendMouseClick("LEFT");
  }

  onRightClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    void this.hapticService.mediumImpact();
    this.protocol2Service.sendMouseClick("RIGHT");
  }
}
