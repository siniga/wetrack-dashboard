import React, { createContext, useReducer } from 'react';
import { authReducer, initialState } from '../reducers/AuthReducer';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginState, dispatchLoginState] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{loginState, dispatchLoginState }}>
      {children}
    </AuthContext.Provider>
  );
};
