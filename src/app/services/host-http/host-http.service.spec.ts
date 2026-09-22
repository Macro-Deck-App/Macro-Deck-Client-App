import {HostHttpService} from "./host-http.service";

describe('HostHttpService', () => {
  it('parses JSON bodies delivered as text', () => {
    expect(HostHttpService.parseBody('{"setupComplete":true}')).toEqual({setupComplete: true});
  });

  it('keeps non JSON text bodies as text', () => {
    expect(HostHttpService.parseBody("<html></html>")).toBe("<html></html>");
  });

  it('keeps already parsed bodies', () => {
    const body = {status: "transferred"};
    expect(HostHttpService.parseBody(body)).toBe(body);
  });
});
