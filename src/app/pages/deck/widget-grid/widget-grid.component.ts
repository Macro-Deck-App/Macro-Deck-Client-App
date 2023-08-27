import {AfterViewInit, ApplicationRef, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {Widget} from "../../../datatypes/widgets/widget";
import {Subscription} from "rxjs";
import {MacroDeckService} from "../../../services/macro-deck/macro-deck.service";
import {WidgetContentType} from "../../../enums/widget-content-type";

@Component({
    selector: 'app-widget-grid',
    templateUrl: './widget-grid.component.html',
    styleUrls: ['./widget-grid.component.scss'],
})
export class WidgetGridComponent implements AfterViewInit, OnDestroy {
    @ViewChild('widgetsWrapper', {static: false}) wrapperElement!: ElementRef;

    constructor(private macroDeckService: MacroDeckService,
                private applicationRef: ApplicationRef) {
    }

    private subscription: Subscription = new Subscription();

    private columns: number = 5;
    private rows: number = 3;
    private widgetSpacing: number = 10;
    private borderRadius: number = 10;

    private buttonSize: number = 0;
    private widgetSpacingPoints: number = 0;
    public static borderRadiusPoints: number = 0;

    private wrapperWidth: number = 0;
    private wrapperHeight: number = 0;
    private wrapperPaddingX: number = 0;
    private wrapperPaddingY: number = 0;

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.subscription.add(this.macroDeckService.configUpdate.subscribe(() => {
            this.loadConfig();
        }));

        this.subscription.add(screen.orientation.onchange = () => {
            setTimeout(() => {
                this.resetSizes();
                this.applicationRef.tick();
            }, 100);
        });

        setTimeout(() => {
            this.loadConfig();
        }, 1000);
    }

    resetSizes() {
        this.rows = 0;
        this.columns = 0;
        this.widgetSpacing = 0;
        this.borderRadius = 0;
        this.loadConfig();
    }

    loadConfig() {
        this.rows = this.macroDeckService.rows;
        this.columns = this.macroDeckService.columns;
        this.widgetSpacing = this.macroDeckService.buttonSpacing;
        this.borderRadius = this.macroDeckService.buttonRadius;
        this.calculateWidgetSize();
    }

    @HostListener('window:resize', ['$event'])
    calculateWidgetSize(): void {
        if (this.wrapperElement == null) {
            return;
        }

        const wrapperStyle = window.getComputedStyle(this.wrapperElement.nativeElement, null);
        this.wrapperPaddingX = parseInt(wrapperStyle.getPropertyValue('padding-left')) +
            parseInt(wrapperStyle.getPropertyValue('padding-right'));
        this.wrapperPaddingY = parseInt(wrapperStyle.getPropertyValue('padding-top')) +
            parseInt(wrapperStyle.getPropertyValue('padding-bottom'));
        this.wrapperWidth = (this.wrapperElement?.nativeElement.offsetWidth ?? 0) - this.wrapperPaddingX;
        this.wrapperHeight = (this.wrapperElement?.nativeElement.offsetHeight ?? 0) - this.wrapperPaddingY;
        let widgetSizeX = this.wrapperWidth / this.columns;
        let widgetSizeY = this.wrapperHeight / this.rows;
        this.buttonSize = Math.min(widgetSizeX, widgetSizeY);

        this.widgetSpacingPoints = (((this.widgetSpacing / 100) * this.buttonSize) * 72 / 96) / 2;
        WidgetGridComponent.borderRadiusPoints = (((this.borderRadius / 100) * this.buttonSize) * 72 / 96) / 2;
    }

    countTotalWidgets(): number {
        return this.rows * this.columns;
    }

    getWidgetStyle(index: number) {
        const row = Math.trunc(index / this.columns);
        const column = Math.trunc(index % this.columns);
        const widget = this.macroDeckService.widgets.find(x => x.row == row && x.column == column);

        const width = this.buttonSize * (widget?.colSpan ?? 1);
        const height = this.buttonSize * (widget?.rowSpan ?? 1);

        const xOffset = (this.wrapperWidth / 2) - ((this.columns * this.buttonSize) / 2); // Offset to center items horizontally
        const yOffset = (this.wrapperHeight / 2) - ((this.rows * this.buttonSize) / 2); // Offset to center items vertically

        const x = xOffset + (column * this.buttonSize);
        const y = yOffset + (row * this.buttonSize);

        return {
            'width': width + 'px',
            'height': height + 'px',
            'position': 'absolute',
            'top': y + "px",
            'left': x + "px"
        }
    }

    getWidgetContentStyle() {
        return {
            'margin': this.widgetSpacingPoints + "pt"
        }
    }

    getWidgetFromIndex(index: number): Widget | undefined {
        const row = Math.trunc(index / this.columns);
        const column = Math.trunc(index % this.columns);
        let widget: Widget | undefined = this.macroDeckService.widgets.find(x => x.row == row && x.column == column);
        if (!widget) {
            widget = {
                backgroundColorHex: '#2d2d2d',
                colSpan: 1,
                column: column,
                row: row,
                rowSpan: 1,
                widgetContent: undefined,
                widgetContentType: WidgetContentType.empty

            }
        }
        return widget;
    }
}
