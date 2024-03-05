import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { ExternalAccount, UserProfile } from "../types";

interface UserData {
  user: User | null;
  userProfile: UserProfile | null;
  externalAccounts: ExternalAccount[];
}

export default function useUser() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<UserData, Error>({
    queryKey: ["userData"],
    queryFn: fetchUserData
  });

  const user = data?.user ?? null;
  const userProfile = data?.userProfile ?? null;
  const externalAccounts = data?.externalAccounts ?? [];

  async function deleteExternalAccount(externalAccountToDelete: ExternalAccount) {
    const { error } = await supabase
      .from("ChessHub_ExternalAccounts")
      .delete()
      .eq("user_profile", userProfile?.id)
      .eq("account", externalAccountToDelete.accountName);

    if (error) {
      throw new Error("Failed to delete external account");
    }

    queryClient.setQueryData<UserData>(["userData"], (oldData) => {
      if (!oldData) {
        return { user: null, userProfile: null, externalAccounts: [] };
      }

      const updatedExternalAccounts = oldData.externalAccounts.filter(
        (account) => account.accountName !== externalAccountToDelete.accountName
      );

      return {
        ...oldData,
        externalAccounts: updatedExternalAccounts
      };
    });
  }

  async function updateExternalAccount(updatedExternalAccount: ExternalAccount) {
    const { error } = await supabase
      .from("ChessHub_ExternalAccounts")
      .update({ account: updatedExternalAccount.accountName })
      .eq("user_profile", userProfile?.id)
      .eq("platform", updatedExternalAccount.platform);

    if (error) {
      throw new Error("Failed to update external account");
    }

    queryClient.setQueryData<UserData>(["userData"], (oldData) => {
      if (!oldData) {
        return { user: null, userProfile: null, externalAccounts: [] };
      }

      const updatedExternalAccounts = oldData.externalAccounts.map((account) => {
        if (account.platform === updatedExternalAccount.platform) {
          return updatedExternalAccount;
        }

        return account;
      });

      return {
        ...oldData,
        externalAccounts: updatedExternalAccounts
      };
    });
  }

  return {
    user,
    userProfile,
    externalAccounts,
    isLoading,
    isError,
    error,
    deleteExternalAccount,
    updateExternalAccount
  };
}

async function fetchUserData(): Promise<UserData> {
  const userResponse = await supabase.auth.getUser();
  if (!userResponse.data.user) {
    throw new Error("User not found");
  }

  const { data: userProfileData, error: userProfileError } = await supabase
    .from("User_Profiles")
    .select("id, display_name")
    .eq("user", userResponse.data.user.id)
    .single();

  if (userProfileError || !userProfileData) {
    throw new Error("Failed to fetch user profile");
  }

  const { data: externalAccountsData, error: externalAccountsError } = await supabase
    .from("ChessHub_ExternalAccounts")
    .select("account, platform")
    .eq("user_profile", userProfileData.id);

  if (externalAccountsError || !externalAccountsData) {
    throw new Error("Failed to fetch external accounts");
  }

  return {
    user: userResponse.data.user,
    userProfile: { id: userProfileData.id, displayName: userProfileData.display_name },
    externalAccounts: externalAccountsData.map((account) => ({
      accountName: account.account,
      platform: account.platform
    }))
  };
}
