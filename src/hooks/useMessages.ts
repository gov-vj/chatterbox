import {useEffect, useState} from "react";
import {supabase} from "../supabaseClient.ts";
import {DbMessage, UserProfile} from "../types";
import {RealtimeChannel, User} from "@supabase/supabase-js";

export const useMessages = (currentUser: User | null, otherUserProfile: UserProfile | null) => {
  const [messages, setMessages] = useState<DbMessage[]>([]);

  useEffect(() => {
    if (!otherUserProfile || !currentUser) {
      return;
    }

    const userId1 = currentUser.id;
    const userId2 = otherUserProfile.id;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      setMessages(data as DbMessage[] ?? []);
    };

    fetchMessages();

    const channelName = `chat-${[userId1, userId2].sort().join('-')}`;
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        console.log('ppp', payload)
        setMessages((prevMessages) => [...prevMessages, payload.new as DbMessage])
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime channel '${channelName}' subscribed.`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Realtime channel error:`, err);
        }
        if (status === 'TIMED_OUT') {
          console.warn(`Realtime channel timed out.`);
        }
      });

    return () => void supabase.removeChannel(channel);
  }, [currentUser, otherUserProfile]);

  return { messages };
};