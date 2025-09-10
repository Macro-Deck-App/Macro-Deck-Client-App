import { inject, Injectable } from '@angular/core';
import { MacroDeckService } from '../macro-deck/macro-deck.service';
import { Protocol2Messages } from '../../datatypes/protocol2/protocol2-messages';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { Protocol2Button } from '../../datatypes/protocol2/protocol2-button';
import { Widget } from '../../datatypes/widgets/widget';
import { ButtonWidget } from '../../datatypes/widgets/button-widget';
import { WidgetContentType } from '../../enums/widget-content-type';
import { WidgetInteraction } from '../../datatypes/widgets/widget-interaction';
import { WidgetInteractionType } from '../../enums/widget-interaction-type';
import { LoadingService } from '../loading/loading.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Protocol2Service {
  private initialConfigReceived = false;
  private socket: WebSocketSubject<any> | undefined;

  private readonly router = inject(Router);

  constructor(
    private macroDeckService: MacroDeckService,
    private loadingService: LoadingService,
  ) {
    macroDeckService.interaction.subscribe((interaction) => {
      this.handleInteraction(interaction);
    });
  }

  async handleMessage(message: any) {
    if (!message.Method) {
      return;
    }

    switch (message.Method) {
      case 'GET_CONFIG':
        this.macroDeckService.setConfig(message);
        if (!this.initialConfigReceived) {
          this.initialConfigReceived = true;
          this.router.navigate(['deck']);
          await this.loadingService.dismiss();
        }

        this.send(Protocol2Messages.getGetButtonsMessage());
        break;
      case 'GET_BUTTONS':
        if (!this.initialConfigReceived) {
          return;
        }

        let widgets: Widget[] = message.Buttons.map(
          (button: Protocol2Button) => {
            return this.mapProtocol2ButtonToWidget(button);
          },
        );

        this.macroDeckService.setWidgets(widgets);
        break;
      case 'UPDATE_BUTTON':
        if (!this.initialConfigReceived) {
          return;
        }

        let widget = this.mapProtocol2ButtonToWidget(message.Buttons[0]);

        this.macroDeckService.updateWidget(widget);
        break;
      case 'UPDATE_LABEL':
        if (!this.initialConfigReceived) {
          return;
        }

        let receivedButton = message.Buttons[0] as Protocol2Button;
        let existingWidget = this.macroDeckService.widgets.find(
          (x) =>
            x.row === receivedButton.Position_Y &&
            x.column === receivedButton.Position_X,
        );
        if (existingWidget === undefined) {
          return;
        }

        let existingWidgetContent =
          existingWidget?.widgetContent as ButtonWidget;
        existingWidgetContent.labelBase64 = receivedButton.LabelBase64;

        this.macroDeckService.updateWidget(existingWidget);
        break;
    }
  }

  setWebsocketSubject(socket: WebSocketSubject<any>) {
    this.initialConfigReceived = false;
    this.socket = socket;
  }

  private mapProtocol2ButtonToWidget(button: Protocol2Button): Widget {
    let buttonWidget: ButtonWidget = {
      iconBase64: button.IconBase64,
      labelBase64: button.LabelBase64,
    };
    return {
      backgroundColorHex: button.BackgroundColorHex,
      colSpan: 1,
      column: button.Position_X,
      row: button.Position_Y,
      rowSpan: 1,
      widgetContentType: WidgetContentType.button,
      widgetContent: buttonWidget,
    };
  }

  private send(payload: any) {
    this.socket?.next(payload);
  }

  private handleInteraction(interaction: WidgetInteraction) {
    let method: String | undefined;
    switch (interaction.widgetInteractionType) {
      case WidgetInteractionType.ButtonPress:
        method = 'BUTTON_PRESS';
        break;
      case WidgetInteractionType.ButtonShortPressRelease:
        method = 'BUTTON_RELEASE';
        break;
      case WidgetInteractionType.ButtonLongPress:
        method = 'BUTTON_LONG_PRESS';
        break;
      case WidgetInteractionType.ButtonLongPressRelease:
        method = 'BUTTON_LONG_PRESS_RELEASE';
        break;
    }
    this.send({
      Method: method,
      Message: `${interaction.widget.row}_${interaction.widget.column}`,
    });
  }
}
