import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Widget} from "../../datatypes/widgets/widget";
import {ButtonWidget} from "../../datatypes/widgets/button-widget";
import {WidgetGridComponent} from "../../pages/deck/widget-grid/widget-grid.component";
import {MacroDeckService} from "../../services/macro-deck/macro-deck.service";
import {WidgetInteractionType} from "../../enums/widget-interaction-type";
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from "../../services/settings/settings.service";
import {ButtonWidgetBorderStyle} from "./button-widget-border-style";
import {Subscription} from "rxjs";
import {SettingsModalComponent} from "../../pages/shared/modals/settings-modal/settings-modal.component";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-button-widget',
  templateUrl: './button-widget.component.html',
  styleUrls: ['./button-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgStyle
]
})
export class ButtonWidgetComponent implements OnInit, OnDestroy {
  protected readonly widgetGridComponent = WidgetGridComponent;

  foregroundImage: any;
  iconImage: any;
  backgroundStyle: any;
  borderColor: string | undefined;
  widget: Widget | undefined;
  borderStyle: any;

  private longPressTrigger: boolean = false;
  private longPressTimeout: any;
  private pressed: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private renderer: Renderer2,
              private macroDeckService: MacroDeckService,
              private sanitizer: DomSanitizer,
              private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.widgetGridComponent.updated.subscribe(async _ => {
      await this.updateSelf();
    }));

    this.subscription.add(SettingsModalComponent.settingsApplied.subscribe(async _ => {
      await this.updateSelf();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async updateSelf() {
    if (this.widget === undefined) {
      return;
    }

    await this.updateWidget(this.widget);
  }

  async updateWidget(widget: Widget) {
    let borderStyle = await this.settingsService.getButtonWidgetBorderStyle();
    this.widget = widget;
    const widgetContent = widget.widgetContent as ButtonWidget;
    this.foregroundImage = widgetContent?.labelBase64
      ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + widgetContent?.labelBase64)
      : undefined;
    this.iconImage = widgetContent?.iconBase64
      ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + widgetContent?.iconBase64)
      : undefined;
    this.backgroundStyle = {'background-color': widget.backgroundColorHex};
    this.borderColor = widget.backgroundColorHex ? this.adjustColor(widget.backgroundColorHex, -40) : undefined;
    this.setBorderStyle(borderStyle);
  }

  private setBorderStyle(borderStyle: ButtonWidgetBorderStyle) {
    switch (borderStyle) {
      case ButtonWidgetBorderStyle.None:
        this.borderStyle = {
          'border-radius': this.widgetGridComponent.borderRadiusPoints + 'pt'
        }
        break;
      case ButtonWidgetBorderStyle.Colored:
        this.borderStyle = {
          'border-radius': this.widgetGridComponent.borderRadiusPoints + 'pt',
          'border': '2pt solid ' + this.borderColor,
          'padding': '2pt'
        }
        break;
    }
  }

  onMouseUp(event: Event) {
    if (!this.pressed) {
      return;
    }

    this.pressed = false;
    this.setClass(event.currentTarget, 'pressed', false);
    this.setClass(event.currentTarget, 'release-transition', true);

    if (this.longPressTrigger) {
      if (this.widget === undefined) {
        return;
      }
      this.emitInteraction(WidgetInteractionType.ButtonLongPressRelease);
    } else {
      this.emitInteraction(WidgetInteractionType.ButtonShortPressRelease);
    }
    this.longPressTrigger = false;
    clearTimeout(this.longPressTimeout);
  }

  async onMouseLeave(event: Event) {
    this.onMouseUp(event);
  }

  async onMouseDown(event: Event) {
    this.setClass(event.currentTarget, 'pressed', true);
    this.setClass(event.currentTarget, 'release-transition', false);
    this.emitInteraction(WidgetInteractionType.ButtonPress);
    this.pressed = true;

    let buttonLongPressDelay = await this.settingsService.getButtonLongPressDelay();

    setTimeout(() => {

    });
    this.longPressTimeout = setTimeout(() => {
      this.longPressTrigger = true;
      this.emitInteraction(WidgetInteractionType.ButtonLongPress);
    }, buttonLongPressDelay);
  }

  setClass(target: any, className: string, value: boolean): void {
    const hasClass = target.classList.contains(className);
    if (value && !hasClass) {
      this.renderer.addClass(target, className);
    } else if (!value && hasClass) {
      this.renderer.removeClass(target, className);
    }
  }

  adjustColor(color: string, amount: number) {
      return '#' + color.replace(/^#/, '')
          .replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount))
          .toString(16))
          .substr(-2));
  }

  private emitInteraction(widgetInteractionType: WidgetInteractionType) {
    if (this.widget === undefined) {
      return;
    }
    this.macroDeckService.interaction.emit({
      widget: this.widget,
      widgetInteractionType: widgetInteractionType
    });
  }
}
