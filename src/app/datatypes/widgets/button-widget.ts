import { WidgetContent } from './widget-content';

export interface ButtonWidget extends WidgetContent {
  iconBase64: string | undefined;
  labelBase64: string | undefined;
}
