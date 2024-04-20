export interface Connection {
  id: string,
  name: string,
  host: string,
  port: number,
  ssl: boolean,
  index: number | undefined
}
