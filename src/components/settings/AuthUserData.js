export function authUserData() {
  if (localStorage.getItem("user")) return JSON.parse(localStorage.getItem("user"));
}


export function authUserBusinessData() {
  if (localStorage.getItem("user_business")) return JSON.parse(localStorage.getItem("user_business"));
}
