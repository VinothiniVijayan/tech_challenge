import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.test.techchallenge',
  appName: 'TechChallenge',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins":{
    "GoogleAuth":{
      "scopes":[
        "profile",
        "email"
      ],
      "serverClientId":"841041641794-6fc94aj6aq7ne84vd6u3ggkjc8d6gp7p.apps.googleusercontent.com",
      "forceCodeForRefreshToken":true
    }
  }
}
;

export default config;
