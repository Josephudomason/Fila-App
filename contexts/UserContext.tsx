import { createContext, ReactNode, useEffect, useState } from "react";
import { ID, type Models } from "react-native-appwrite";
import { account } from "../lib/appwrite";

export interface Credentials {
  email: string;
  password: string;
}

export type User = Models.User;

type UserContextValue = {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  authChecked: boolean;
};

type UserProviderProps = {
  children?: ReactNode;
};

const getErrorMessage = (error: unknown) => (
  error instanceof Error ? error.message : 'Authentication failed. Please try again.'
);

export const userContext = createContext<UserContextValue | undefined>(undefined);



export const UserProvider = ({ children }: UserProviderProps) => {

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);


  async function login({ email, password }: Credentials): Promise<void> {
    try {
      await account.createEmailPasswordSession(email, password)

      const response = await account.get();

      setUser(response)
    } catch (error: unknown) {
      throw Error(getErrorMessage(error));
    }
  }

  async function register({ email, password }: Credentials): Promise<void> {
    try {
      await account.create(ID.unique(), email, password)
      await login({ email, password })
    } catch (error: unknown) {
      throw Error(getErrorMessage(error));

    }
  }


  async function logout(): Promise<void> {
    await account.deleteSession('current');
    setUser(null)
  }

  async function getInitialUserValue() {
    try {
      const res = await account.get();
      setUser(res)
    } catch (error) {
      setUser(null)
    } finally {
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, [])

  return (
    <userContext.Provider value={{ user, login, logout, register, authChecked }}>
      {children}
    </userContext.Provider>
  );

};


