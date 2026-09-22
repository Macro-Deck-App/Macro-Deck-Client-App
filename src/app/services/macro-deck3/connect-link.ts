export interface ConnectLinkEndpoint {
  address: string;
  port: number;
  ssl: boolean;
}

export interface ConnectLink {
  instanceName: string;
  endpoints: ConnectLinkEndpoint[];
  identityFingerprint: string | null;
}

const connectLinkPattern = /^https?:\/\/connect\.macro-deck\.app\//i;

export function isMacroDeck3ConnectLink(content: string): boolean {
  return connectLinkPattern.test(content.trim());
}

// Payload version 3 as specified in Macro-Deck engineering/api/connect-link.md.
export function decodeMacroDeck3ConnectLink(content: string): ConnectLink | null {
  const trimmed = content.trim();
  if (!isMacroDeck3ConnectLink(trimmed)) {
    return null;
  }
  const digits = trimmed.replace(connectLinkPattern, "").split(/[?#]/)[0].replace(/\/$/, "");
  const bytes = digitsToBytes(digits);
  if (!bytes) {
    return null;
  }

  let offset = 0;
  const read = (count: number): Uint8Array | null => {
    if (offset + count > bytes.length) {
      return null;
    }
    const slice = bytes.slice(offset, offset + count);
    offset += count;
    return slice;
  };
  const readByte = (): number | null => read(1)?.[0] ?? null;

  if (readByte() !== 3) {
    return null;
  }
  const nameLength = readByte();
  const nameBytes = nameLength === null ? null : read(nameLength);
  const instanceName = nameBytes === null ? null : decodeUtf8(nameBytes);
  if (instanceName === null) {
    return null;
  }
  const endpointCount = readByte();
  if (endpointCount === null) {
    return null;
  }

  const endpoints: ConnectLinkEndpoint[] = [];
  for (let i = 0; i < endpointCount; i++) {
    const type = readByte();
    let address: string | null = null;
    if (type === 0) {
      const ip = read(4);
      address = ip ? Array.from(ip).join(".") : null;
    } else if (type === 1) {
      const ip = read(16);
      address = ip ? `[${formatIpv6(ip)}]` : null;
    } else if (type === 2) {
      const length = readByte();
      const name = length === null ? null : read(length);
      address = name ? String.fromCharCode(...Array.from(name)) : null;
    } else {
      return null;
    }
    const port = read(2);
    const flags = readByte();
    if (address === null || port === null || flags === null) {
      return null;
    }
    endpoints.push({address: address, port: port[0] * 256 + port[1], ssl: (flags & 1) === 1});
  }

  const tokenLength = readByte();
  if (tokenLength === null || read(tokenLength) === null) {
    return null;
  }
  const remaining = bytes.length - offset;
  if (remaining !== 0 && remaining !== 12) {
    return null;
  }
  return {
    instanceName: instanceName,
    endpoints: endpoints,
    identityFingerprint: remaining === 12 ? formatIdentityFingerprint(bytes.slice(offset)) : null
  };
}

function decodeUtf8(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder("utf-8", {fatal: true}).decode(bytes);
  } catch {
    return null;
  }
}

export function formatIdentityFingerprint(bytes: Uint8Array): string {
  const hex = Array.from(bytes.slice(0, 12)).map(x => x.toString(16).toUpperCase().padStart(2, "0")).join("");
  return hex.match(/.{4}/g)!.join(" ");
}

function digitsToBytes(digits: string): Uint8Array | null {
  if (!/^\d*$/.test(digits)) {
    return null;
  }
  const tail = digits.length % 5;
  if (tail !== 0 && tail !== 3) {
    return null;
  }
  const bytes: number[] = [];
  const pairs = Math.floor(digits.length / 5);
  for (let i = 0; i < pairs; i++) {
    const value = Number(digits.substring(i * 5, i * 5 + 5));
    if (value > 65535) {
      return null;
    }
    bytes.push(value >> 8, value & 0xff);
  }
  if (tail === 3) {
    const value = Number(digits.substring(pairs * 5));
    if (value > 255) {
      return null;
    }
    bytes.push(value);
  }
  return new Uint8Array(bytes);
}

function formatIpv6(bytes: Uint8Array): string {
  const groups: string[] = [];
  for (let i = 0; i < 16; i += 2) {
    groups.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
  }
  return groups.join(":");
}
