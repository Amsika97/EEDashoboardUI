export interface IEnvironment {
  production?: boolean;
  URL?: string;
  BASE_URL?: string;
  SSOAuthority?: string;
  SSORedirectUri?: string;
  SSOPostLogoutRedirectUri?: string;
  SSOClientId?: string;
}
