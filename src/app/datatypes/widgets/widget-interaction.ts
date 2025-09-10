import { WidgetInteractionType } from '../../enums/widget-interaction-type';
import { Widget } from './widget';

export interface WidgetInteraction {
  widget: Widget;
  widgetInteractionType: WidgetInteractionType;
}
