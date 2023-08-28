// utils/token.js

export const getTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  