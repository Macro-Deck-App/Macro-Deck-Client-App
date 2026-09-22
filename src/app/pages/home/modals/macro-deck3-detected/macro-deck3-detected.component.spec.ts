import {TestBed} from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";
import {MacroDeck3DetectedComponent} from "./macro-deck3-detected.component";
import {DiagnosticService} from "../../../../services/diagnostic/diagnostic.service";
import {LicenseTransferService} from "../../../../services/license-transfer/license-transfer.service";

describe('MacroDeck3DetectedComponent', () => {
  let ios: boolean;
  let transferredTo: string[];
  let transferError: boolean;
  let identityConfirmed: boolean;

  function create(baseUrl: string | null) {
    TestBed.configureTestingModule({
      imports: [MacroDeck3DetectedComponent, IonicModule.forRoot()],
      providers: [
        {provide: DiagnosticService, useValue: {isiOS: () => ios}},
        {
          provide: LicenseTransferService, useValue: {
            transfer: async (url: string) => {
              if (transferError) {
                throw new Error("storage");
              }
              transferredTo.push(url);
              return {state: "transferred", code: null};
            }
          }
        }
      ]
    });
    const fixture = TestBed.createComponent(MacroDeck3DetectedComponent);
    fixture.componentInstance.baseUrl = baseUrl;
    spyOn(fixture.componentInstance, "confirmIdentity").and.callFake(async () => identityConfirmed);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    ios = true;
    transferredTo = [];
    transferError = false;
    identityConfirmed = true;
  });

  it('does not transfer when the identity is not confirmed', async () => {
    identityConfirmed = false;
    const fixture = create("http://192.168.1.10:8193");
    await fixture.componentInstance.transfer();
    expect(fixture.componentInstance.confirmIdentity).toHaveBeenCalled();
    expect(transferredTo).toEqual([]);
  });

  it('never offers a transfer on Android', async () => {
    ios = false;
    const fixture = create("http://192.168.1.10:8193");
    await fixture.componentInstance.transfer();
    expect(fixture.componentInstance.transferEnabled).toBeFalse();
    expect(transferredTo).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain("only supports Macro Deck 2");
  });

  it('does not transfer on iOS before the user confirms', () => {
    const fixture = create("http://192.168.1.10:8193");
    expect(transferredTo).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain("Transfer my purchase to 192.168.1.10:8193");
  });

  it('transfers on iOS after the user confirms the identity', async () => {
    const fixture = create("http://192.168.1.10:8193");
    await fixture.componentInstance.transfer();
    fixture.detectChanges();
    expect(transferredTo).toEqual(["http://192.168.1.10:8193"]);
    expect(fixture.nativeElement.textContent).toContain("has been transferred");
  });

  it('names the host by its connection name', () => {
    const fixture = create("http://192.168.1.10:8193");
    fixture.componentInstance.name = "Gaming PC";
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Transfer my purchase to Gaming PC");
  });

  it('offers to try again after a failure', async () => {
    transferError = true;
    const fixture = create("http://192.168.1.10:8193");
    await fixture.componentInstance.transfer();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Try again");
  });

  it('offers no transfer without a host address', () => {
    const fixture = create(null);
    expect(fixture.componentInstance.transferEnabled).toBeFalse();
  });

  it('reports an unexpected error as a failure', async () => {
    transferError = true;
    const fixture = create("http://192.168.1.10:8193");
    await fixture.componentInstance.transfer();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Something went wrong");
  });
});
