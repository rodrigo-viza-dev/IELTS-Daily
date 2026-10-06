import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';

import {
  clearAppState,
  createInitialAppState,
  loadAppState,
  saveAppState,
} from '@/storage/app-storage';
import type { AppState } from '@/types/models';

type AppContextValue = {
  state: AppState;
  isHydrated: boolean;
  setState: Dispatch<SetStateAction<AppState>>;
  resetState: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(() => createInitialAppState());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void loadAppState().then((loadedState) => {
      if (isMounted) {
        setState(loadedState);
        setIsHydrated(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrated) {
      void saveAppState(state).catch(() => undefined);
    }
  }, [isHydrated, state]);

  const resetState = useCallback(async () => {
    await clearAppState();
    setState(createInitialAppState());
  }, []);

  return (
    <AppContext.Provider value={{ state, isHydrated, setState, resetState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }

  return context;
}
