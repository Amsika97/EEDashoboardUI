import { IEnvironment } from './types';

export const environment: IEnvironment = {
  production: true,
  BASE_URL: 'https://eedashboard.maveric-systems.com',
  SSOClientId: '0db5c660-efdc-4b31-a05e-a41c4f959afa',
  SSOAuthority:
    'https://login.microsoftonline.com/1987bc45-e629-47d3-9326-b5300dd15e34',
  SSORedirectUri: 'https://eedashboard.maveric-systems.com:443/',
  SSOPostLogoutRedirectUri: 'https://myapplications.microsoft.com/',
};
