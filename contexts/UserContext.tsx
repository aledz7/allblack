import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_NAME_KEY = "@allblack:userName";

type UserContextType = {
  name: string;
  setName: (name: string) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(USER_NAME_KEY).then((stored) => {
      if (stored) setNameState(stored);
      setIsLoading(false);
    });
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    AsyncStorage.setItem(USER_NAME_KEY, newName);
  };

  const displayName = name.trim() || "Atleta";

  return (
    <UserContext.Provider
      value={{ name: displayName, setName, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
