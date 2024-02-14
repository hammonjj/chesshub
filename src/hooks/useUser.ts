import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient'
import { User } from '@supabase/supabase-js';

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getUserData() {
            const userData = await supabase.auth.getUser();
            setUser(userData.data.user);
        }

        getUserData();
    }, []);

    return user;
}