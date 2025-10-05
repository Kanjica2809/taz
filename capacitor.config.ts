import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4ee8d30458284fee999d208cf75508c7',
  appName: 'modern-seaside-stay-3260-98',
  webDir: 'dist',
  server: {
    url: 'https://4ee8d304-5828-4fee-999d-208cf75508c7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug'
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    handleApplicationURL: false
  }
};

export default config;