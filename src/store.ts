import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { ExternalAccount, UserProfile } from './types';

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;

  userProfile: UserProfile | null;
  setUserProfile: (userProfile: UserProfile) => void;

  externalAccounts: ExternalAccount[];
  setExternalAccounts: (externalAccounts: ExternalAccount[]) => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user: user }),
  userProfile: null,
  setUserProfile: (userProfile: UserProfile) => set({ userProfile: userProfile }),
  externalAccounts: [],
  setExternalAccounts: (externalAccounts: ExternalAccount[]) => set({ externalAccounts: externalAccounts }),
}));

export default useStore;