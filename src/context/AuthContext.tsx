/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/appwrite/api';
import { IContextType, IUser } from '../types';

const INITIAL_USER = {
  id: '',
  username: '',
  password: '',
  email: '',
  name: '',
  imageUrl: '',
  bio: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function checkAuthUser() {
    try {
      const curAccount = await getCurrentUser();

      if (!curAccount) return false;

      setUser({
        //@ts-ignore
        id: curAccount.$id,
        //@ts-ignore
        username: curAccount.username,
        //@ts-ignore
        email: curAccount.email,
        //@ts-ignore
        name: curAccount.name,
        //@ts-ignore
        bio: curAccount.bio,
        //@ts-ignore
        imageUrl: curAccount.imageUrl,
      });

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(
    function () {
      if (localStorage.getItem('cookieFallBack') === '[]') navigate('/sign-in');

      checkAuthUser();
    },
    [navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export function useUserContext() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('The Context used outside the Provider');

  return context;
}
