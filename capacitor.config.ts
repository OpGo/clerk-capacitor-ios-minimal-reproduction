import type { CapacitorConfig } from '@capacitor/cli';


const PRODUCTION = false


const config: CapacitorConfig = {
  appId: 'com.example.appId',
  appName: 'Appname',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: !PRODUCTION,
  },
  server: {
    cleartext: !PRODUCTION,
  },
};

export default config;
