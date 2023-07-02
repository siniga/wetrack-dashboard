export const initialState = {
  isLoggedIn: false,
  token: "",
  user: null
};

export const authReducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        token: action.payload.token,
        user: action.payload.user
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        token: "",
        user: null
      };
    default:
      return state;
  }
};