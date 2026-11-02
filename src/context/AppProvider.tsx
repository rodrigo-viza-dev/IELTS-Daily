import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type PropsWithChildren,
} from 'react';

import { appReducer, type AppAction } from '@/context/app-reducer';
import {
  clearAppState,
  createInitialAppState,
  loadAppState,
  saveAppState,
} from '@/storage/app-storage';
import type { AppState } from '@/types/models';

type AppContextValue = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  isHydrated: boolean;
  resetState: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialAppState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void loadAppState().then((loadedState) => {
      if (!isMounted) {
        return;
      }

      dispatch({ type: 'hydrate', state: loadedState });
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void saveAppState(state).catch(() => undefined);
  }, [isHydrated, state]);

  const resetState = useCallback(async () => {
    await clearAppState();
    dispatch({ type: 'reset' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isHydrated, resetState }}>
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
