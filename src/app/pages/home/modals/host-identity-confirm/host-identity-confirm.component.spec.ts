import {TestBed} from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";
import {HostIdentityConfirmComponent} from "./host-identity-confirm.component";
import {HostIdentityResult, HostIdentityService} from "../../../../services/license-transfer/host-identity.service";

describe('HostIdentityConfirmComponent', () => {
  let identity: HostIdentityResult;

  async function create(expected: string | null) {
    TestBed.configureTestingModule({
      imports: [HostIdentityConfirmComponent, IonicModule.forRoot()],
      providers: [{provide: HostIdentityService, useValue: {verify: async () => identity}}]
    });
    const fixture = TestBed.createComponent(HostIdentityConfirmComponent);
    fixture.componentInstance.baseUrl = "http://192.168.1.20:8193";
    fixture.componentInstance.hostName = "Gaming PC";
    fixture.componentInstance.expectedIdentityFingerprint = expected;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  const text = (fixture: any) => fixture.nativeElement.textContent as string;

  it('shows the verified identity and offers the transfer', async () => {
    identity = {state: "verified", fingerprint: "3208 E004 6ED3 EE6B 4E75 1027"};
    const fixture = await create(null);
    expect(text(fixture)).toContain("3208 E004 6ED3");
    expect(text(fixture)).toContain("EE6B 4E75 1027");
    expect(text(fixture)).toContain("Identity matches, transfer");
  });

  it('confirms a match with the scanned QR code', async () => {
    identity = {state: "verified", fingerprint: "3208 E004 6ED3 EE6B 4E75 1027"};
    const fixture = await create("3208 E004 6ED3 EE6B 4E75 1027");
    expect(text(fixture)).toContain("matches the identity in the scanned QR code");
    expect(text(fixture)).toContain("Identity matches, transfer");
  });

  it('blocks the transfer when the identity differs from the QR code', async () => {
    identity = {state: "verified", fingerprint: "3208 E004 6ED3 EE6B 4E75 1027"};
    const fixture = await create("0000 0000 0000 0000 0000 0000");
    expect(text(fixture)).toContain("does not match the scanned QR code");
    expect(text(fixture)).not.toContain("Identity matches, transfer");
  });

  it('blocks the transfer when the host cannot prove its identity', async () => {
    identity = {state: "invalid", fingerprint: null};
    const fixture = await create(null);
    expect(text(fixture)).toContain("could not prove its identity");
    expect(text(fixture)).not.toContain("Identity matches, transfer");
  });
});
