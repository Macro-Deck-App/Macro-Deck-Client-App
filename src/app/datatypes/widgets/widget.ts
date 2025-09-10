import { WidgetContent } from './widget-content';
import { WidgetContentType } from '../../enums/widget-content-type';

export interface Widget {
  column: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  backgroundColorHex: string | undefined;
  widgetContentType: WidgetContentType;
  widgetContent: WidgetContent | undefined;
}
