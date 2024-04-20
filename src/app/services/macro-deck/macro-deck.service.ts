import {EventEmitter, Injectable, Output} from '@angular/core';
import {WebsocketService} from "../websocket/websocket.service";
import {Widget} from "../../datatypes/widgets/widget";
import {WidgetInteraction} from "../../datatypes/widgets/widget-interaction";

@Injectable({
  providedIn: 'root'
})
export class MacroDeckService {
  @Output() configUpdate = new EventEmitter();
  @Output() interaction = new EventEmitter<WidgetInteraction>();

  widgets: Widget[] = [];
  rows: number = 3;
  columns: number = 5;
  buttonSpacing: number = 10;
  buttonRadius: number = 40;
  buttonBackground: boolean = true;

  constructor() {
  }

  setConfig(message: any) {
    this.rows = message.Rows;
    this.columns = message.Columns;
    this.buttonSpacing = message.ButtonSpacing;
    this.buttonRadius = message.ButtonRadius;
    this.buttonBackground = message.ButtonBackground;
    this.configUpdate.emit();
  }

  setWidgets(widgets: Widget[]) {
    this.widgets = widgets;
  }

  updateWidget(widget: Widget) {
    let existingWidgetIndex = this.widgets.findIndex(x => x.row == widget.row && x.column == widget.column);
    if (existingWidgetIndex !== -1) {
      this.widgets[existingWidgetIndex] = widget;
    } else {
      this.widgets.push(widget);
    }
  }
}
