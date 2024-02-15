import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { ExternalAccount, UserProfile } from '../types';

interface UserData {
user: User | null;
userProfile: UserProfile | null;
externalAccounts: ExternalAccount[];
}

export default function useUser(){
    const { data, isLoading, isError, error } = useQuery<UserData, Error>({
        queryKey: ['userData'],
        queryFn: fetchUserData,
    });

    const user = data?.user ?? null;
    const userProfile = data?.userProfile ?? null;
    const externalAccounts = data?.externalAccounts ?? [];

    return { user, userProfile, externalAccounts, isLoading, isError, error };
}

async function fetchUserData(): Promise<UserData> {
    const userResponse = await supabase.auth.getUser();
    if (!userResponse.data.user) {
        throw new Error('User not found');
    }

    const { data: userProfileData, error: userProfileError } = await supabase
        .from('User_Profiles')
        .select('id, display_name')
        .eq('user', userResponse.data.user.id)
        .single();

    if (userProfileError || !userProfileData) {
        throw new Error('Failed to fetch user profile');
    }

    const { data: externalAccountsData, error: externalAccountsError } = await supabase
        .from('ChessHub_ExternalAccounts')
        .select('account, platform')
        .eq('user_profile', userProfileData.id);

    if (externalAccountsError || !externalAccountsData) {
        throw new Error('Failed to fetch external accounts');
    }

    return {
        user: userResponse.data.user,
        userProfile: { id: userProfileData.id, displayName: userProfileData.display_name },
        externalAccounts: externalAccountsData.map(account => ({
            accountName: account.account,
            platform: account.platform,
        })),
    };
}