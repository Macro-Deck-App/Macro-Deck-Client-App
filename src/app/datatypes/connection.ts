export interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  ssl: boolean;
  index: number | undefined;
  autoConnect: boolean | undefined;
  usbConnection: boolean | undefined;
  token: string | undefined;
}
