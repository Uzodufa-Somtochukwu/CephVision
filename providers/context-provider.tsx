'use client'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface AngleValue {
  value: number;
  // You can add more later if needed
  // landmarks?: string[];
}

export interface ContextProviderI {
  angles: Record<string, AngleValue>;

  setAngle: (label: string, value: number) => void;

  getAngle: (label: string) => AngleValue | undefined;

  clearAngles: () => void;
}

const appContext = createContext<ContextProviderI | undefined>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  const [angles, setAngles] = useState<Record<string, AngleValue>>({});

  const setAngle = useCallback((label: string, value: number) => {
    setAngles((prev) => ({
      ...prev,
      [label]: {
        value,
      },
    }));
  },[]);

  const getAngle = useCallback((label: string) => {
    return angles[label];
  },[]);

  const clearAngles = useCallback(() => {
    setAngles({});
  },[]);

  console.log('angles', angles)

  return (
    <appContext.Provider
      value={{
        angles,
        setAngle,
        getAngle,
        clearAngles,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(appContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside ContextProvider"
    );
  }

  return context;
};

export default ContextProvider;