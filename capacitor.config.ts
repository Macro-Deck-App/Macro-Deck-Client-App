import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.suchbyte.macrodeck',
  appName: 'Macro Deck Client',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  ios: {
    scheme: 'Macro Deck Client'
  }
};

export default config;
