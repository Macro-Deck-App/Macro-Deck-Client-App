import {AfterContentInit, AfterViewInit, ApplicationRef, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {Widget} from "../../../datatypes/widgets/widget";
import {Subscription} from "rxjs";
import {MacroDeckService} from "../../../services/macro-deck/macro-deck.service";
import {WidgetContentType} from "../../../enums/widget-content-type";

@Component({
    selector: 'app-widget-grid',
    templateUrl: './widget-grid.component.html',
    styleUrls: ['./widget-grid.component.scss'],
})
export class WidgetGridComponent implements AfterContentInit, OnDestroy {
    @ViewChild('widgetsWrapper', {static: false}) wrapperElement!: ElementRef;

    constructor(private macroDeckService: MacroDeckService,
                private applicationRef: ApplicationRef) {
    }

    private subscription: Subscription = new Subscription();

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

    ngAfterContentInit(): void {
      this.subscription.add(this.macroDeckService.configUpdate.subscribe(() => {
        this.calculateWidgetSize();
        this.applicationRef.tick();
      }));

      this.subscription.add(screen.orientation.onchange = () => {
        setTimeout(() => {
          this.calculateWidgetSize();
          this.applicationRef.tick();
        }, 100);
      });

      setTimeout(() => {
        this.calculateWidgetSize();
      }, 1000);
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
        let widgetSizeX = this.wrapperWidth / this.macroDeckService.columns;
        let widgetSizeY = this.wrapperHeight / this.macroDeckService.rows;
        this.buttonSize = Math.min(widgetSizeX, widgetSizeY);

        this.widgetSpacingPoints = (((this.macroDeckService.buttonSpacing / 100) * this.buttonSize) * 72 / 96) / 2;
        WidgetGridComponent.borderRadiusPoints = (((this.macroDeckService.buttonRadius / 100) * this.buttonSize) * 72 / 96) / 2;
    }

    countTotalWidgets(): number {
        return this.macroDeckService.rows * this.macroDeckService.columns;
    }

    getWidgetStyle(index: number) {
        const row = Math.trunc(index / this.macroDeckService.columns);
        const column = Math.trunc(index % this.macroDeckService.columns);
        const widget = this.macroDeckService.widgets.find(x => x.row == row && x.column == column);

        const width = this.buttonSize * (widget?.colSpan ?? 1);
        const height = this.buttonSize * (widget?.rowSpan ?? 1);

        const xOffset = (this.wrapperWidth / 2) - ((this.macroDeckService.columns * this.buttonSize) / 2); // Offset to center items horizontally
        const yOffset = (this.wrapperHeight / 2) - ((this.macroDeckService.rows * this.buttonSize) / 2); // Offset to center items vertically

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
        const row = Math.trunc(index / this.macroDeckService.columns);
        const column = Math.trunc(index % this.macroDeckService.columns);
        let widget: Widget | undefined = this.macroDeckService.widgets.find(x => x.row == row && x.column == column);
        if (!widget) {
            widget = {
                backgroundColorHex: '#232323',
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
