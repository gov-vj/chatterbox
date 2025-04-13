import {useEffect, useState} from "react";
import {supabase} from "../supabaseClient.ts";
import {User} from "@supabase/supabase-js";
import {UserProfile} from "../types";

const USER_ONE_EMAIL = import.meta.env.VITE_ALLOWED_USER_1_EMAIL;
const USER_TWO_EMAIL = import.meta.env.VITE_ALLOWED_USER_2_EMAIL;

export function useChatParticipants() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) {
        return;
      }

      const { data: otherUserProfile } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .eq('email', user.email === USER_ONE_EMAIL ? USER_TWO_EMAIL : USER_ONE_EMAIL)
        .single();
      setOtherUserProfile(otherUserProfile);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return {
    currentUser,
    otherUserProfile,
    isLoading,
  };
}