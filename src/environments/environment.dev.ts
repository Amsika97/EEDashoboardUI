import { IEnvironment } from './types';

export const environment: IEnvironment = {
  production: false,
  BASE_URL: 'https://172.16.238.22:8083',
  SSOClientId: 'e6a48d46-a679-4213-bf49-0d24175e9b8e',
  SSOAuthority:
    'https://login.microsoftonline.com/1987bc45-e629-47d3-9326-b5300dd15e34',
  SSORedirectUri: 'https://172.16.238.22:443/',
  SSOPostLogoutRedirectUri: 'https://myapplications.microsoft.com/',
};
