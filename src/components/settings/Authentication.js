export function authToken() {
  if (localStorage.getItem("auth_token"))
    return localStorage.getItem("auth_token");
}
