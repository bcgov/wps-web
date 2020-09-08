// use TypeScript's interface declaration merging
interface Window {
  env: {
    REACT_APP_KEYCLOAK_AUTH_URL: string
    REACT_APP_KEYCLOAK_REALM: string
    REACT_APP_KEYCLOAK_CLIENT: string
    REACT_APP_FIDER_LINK: string
  }
}
