import { Component } from '@angular/core';
import {Widget} from "../../datatypes/widgets/widget";
import {WidgetGridComponent} from "../../pages/deck/widget-grid/widget-grid.component";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-empty-widget',
  templateUrl: './empty-widget.component.html',
  styleUrls: ['./empty-widget.component.scss'],
  imports: [
    NgStyle
  ]
})
export class EmptyWidgetComponent {

  backgroundStyle: any;

  constructor() { }

  updateWidget(widget: Widget) {
    this.backgroundStyle = {'background-color' : widget.backgroundColorHex};
  }

  protected readonly WidgetGridComponent = WidgetGridComponent;
}
