export interface SslHandlerPlugin {
  skipValidation(options: { value: boolean }): void;
}
