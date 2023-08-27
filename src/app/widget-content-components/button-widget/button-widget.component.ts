import {Component, EventEmitter, OnDestroy, Output, Renderer2} from '@angular/core';
import {Widget} from "../../datatypes/widgets/widget";
import {ButtonWidget} from "../../datatypes/widgets/button-widget";
import {WidgetGridComponent} from "../../pages/deck/widget-grid/widget-grid.component";

@Component({
    selector: 'app-button-widget',
    templateUrl: './button-widget.component.html',
    styleUrls: ['./button-widget.component.scss'],
})
export class ButtonWidgetComponent implements OnDestroy {
    @Output() shortPress = new EventEmitter();
    @Output() shortPressRelease = new EventEmitter();
    @Output() longPress = new EventEmitter();
    @Output() longPressRelease = new EventEmitter();

    foregroundStyle: any;
    iconStyle: any;
    backgroundStyle: any;
    borderColor: string | undefined;

    private longPressTrigger: boolean = false;
    private longPressTimeout: any;

    constructor(private renderer: Renderer2) {
    }

    updateWidget(widget: Widget) {
        const widgetContent = widget.widgetContent as ButtonWidget;
        this.foregroundStyle = {'background-image': `url(data:image/gif;base64,${widgetContent?.labelBase64})`};
        this.iconStyle = {'background-image': `url(data:image/gif;base64,${widgetContent?.iconBase64})`};
        this.backgroundStyle = {'background-color' : widget.backgroundColorHex};
        this.borderColor = widget.backgroundColorHex ? this.adjustColor(widget.backgroundColorHex, -20) : undefined;
    }

    ngOnDestroy() {
        this.shortPress.complete();
    }

    onMouseUp(event: Event) {
        this.setClass(event.currentTarget, 'active', false);
        if (this.longPressTrigger) {
            this.longPressRelease.emit();
        } else {
            this.shortPressRelease.emit();
        }
        this.longPressTrigger = false;
        clearTimeout(this.longPressTimeout);
    }

    onMouseDown(event: Event) {
        this.setClass(event.currentTarget, 'active', true);
        this.shortPress.emit();
        this.longPressTimeout = setTimeout(() => {
            this.longPressTrigger = true;
            this.longPress.emit();
        }, 1000);
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
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    protected readonly WidgetGridComponent = WidgetGridComponent;
}
