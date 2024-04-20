import {NgModule} from "@angular/core";
import {ButtonWidgetComponent} from "./button-widget/button-widget.component";
import {NgIf, NgStyle} from "@angular/common";
import {TouchEventModule} from "ng2-events";
import {EmptyWidgetComponent} from "./empty-widget/empty-widget.component";

@NgModule({
    imports: [
        NgStyle,
        TouchEventModule,
        NgIf
    ],
    exports: [
        TouchEventModule
    ],
    declarations: [
        ButtonWidgetComponent,
        EmptyWidgetComponent
    ]
})
export class WidgetContentComponentsModule {
}
