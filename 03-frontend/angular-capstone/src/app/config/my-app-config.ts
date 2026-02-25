// src/app/config/my-app-config.ts
import { environment } from '../../environments/environment';

const redirectUri = `${window.location.origin}/login/callback`;

const myAppConfig = {
  auth: {
    domain: environment.auth0.domain,
    clientId: environment.auth0.clientId,
    authorizationParams: {
      redirect_uri: redirectUri,
      // audience: environment.auth0.audience,
    },
    cacheLocation: 'localstorage' as const,
    useRefreshTokens: true,
  },

  httpInterceptor: {
    allowedList: [
      // {
      //   uri: `${environment.apiUrl}/orders/*`,
      //   tokenOptions: {
      //     authorizationParams: {
      //       audience: environment.auth0.audience,
      //     },
      //   },
      // },
      // {
      //   uri: `${environment.apiUrl}/checkout/purchase`,
      //   tokenOptions: {
      //     authorizationParams: {
      //       audience: environment.auth0.audience,
      //     },
      //   },
      // },
    ],
  },
};

export default myAppConfig;
