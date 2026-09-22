import {decodeMacroDeck3ConnectLink, isMacroDeck3ConnectLink} from "./connect-link";

const vector = "https://connect.macro-deck.app/00787172632801624942269912819229797295560829628531296980019243009025920025600192430090259200513015881438614641053";
const vectorWithFingerprint = "https://connect.macro-deck.app/00787172632801624942269912819229797295560829628531296980019243009025920025600192430090259200513015881438614641136180227201134542542747029968039";

describe('connect link', () => {
  it('recognizes Macro Deck 3 connect links case-insensitively', () => {
    expect(isMacroDeck3ConnectLink(vector)).toBeTrue();
    expect(isMacroDeck3ConnectLink("HTTPS://Connect.Macro-Deck.app/123")).toBeTrue();
    expect(isMacroDeck3ConnectLink("http://connect.macro-deck.app/123")).toBeTrue();
  });

  it('does not recognize Macro Deck 2 quick setup links', () => {
    expect(isMacroDeck3ConnectLink("https://macro-deck.app/quick-setup/eyJ9")).toBeFalse();
  });

  it('decodes the endpoints of the conformance vector', () => {
    expect(decodeMacroDeck3ConnectLink(vector)).toEqual({
      instanceName: "Companion test host",
      endpoints: [
        {address: "192.168.1.10", port: 8193, ssl: false},
        {address: "192.168.1.10", port: 8194, ssl: true}
      ],
      identityFingerprint: null
    });
  });

  it('decodes the conformance vector with identity fingerprint', () => {
    expect(decodeMacroDeck3ConnectLink(vectorWithFingerprint)).toEqual({
      instanceName: "Companion test host",
      endpoints: [
        {address: "192.168.1.10", port: 8193, ssl: false},
        {address: "192.168.1.10", port: 8194, ssl: true}
      ],
      identityFingerprint: "3208 E004 6ED3 EE6B 4E75 1027"
    });
  });

  it('rejects malformed links', () => {
    expect(decodeMacroDeck3ConnectLink("https://connect.macro-deck.app/0078")).toBeNull();
    expect(decodeMacroDeck3ConnectLink("https://connect.macro-deck.app/99999")).toBeNull();
    expect(decodeMacroDeck3ConnectLink("https://connect.macro-deck.app/abcde")).toBeNull();
    expect(decodeMacroDeck3ConnectLink(vector.slice(0, -5))).toBeNull();
  });

  it('rejects an instance name that is not valid UTF-8', () => {
    expect(decodeMacroDeck3ConnectLink("https://connect.macro-deck.app/0076965280000")).toBeNull();
  });

  it('rejects payload version 4', () => {
    expect(decodeMacroDeck3ConnectLink("https://connect.macro-deck.app/0102400000")).toBeNull();
  });
});
