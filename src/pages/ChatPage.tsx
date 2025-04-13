import {useState, useEffect, useCallback} from 'react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';
import {useNavigate} from "react-router-dom";
import { DbMessage, UserProfile } from '../types';

const USER_ONE_EMAIL = import.meta.env.VITE_ALLOWED_USER_1_EMAIL;
const USER_TWO_EMAIL = import.meta.env.VITE_ALLOWED_USER_2_EMAIL;

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setCurrentUser(user);
      }

      if (!user) {
        return;
      }

      const { data: otherUserProfile } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .eq('email', user.email === USER_ONE_EMAIL ? USER_TWO_EMAIL : USER_ONE_EMAIL)
        .single();
      console.log('Other user profile:', otherUserProfile);
      setOtherUserProfile(otherUserProfile);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!otherUserProfile || !currentUser) {
      return;
    }

    const fetchMessages = async () => {
      const userId1 = currentUser.id;
      const userId2 = otherUserProfile.id;

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      setMessages(data as DbMessage[] ?? []);
    };

    fetchMessages();
  }, [currentUser, otherUserProfile]);


  const handleSendMessage = useCallback(async (message: string) => {
    if (!currentUser || !otherUserProfile) {
      return;
    }

    const messageToSend = {
      sender_id: currentUser.id,
      receiver_id: otherUserProfile.id,
      message: message,
    };

    const { error } = await supabase.from('messages').insert([messageToSend]);
    if (error) {
      console.error('Error sending message:', error);
      alert(`Error sending message: ${error.message}`);
    }
  }, [currentUser, otherUserProfile]);

  const handleLogout = async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if(error) {
      console.error("Sign out error:", error);
      alert(`Error signing out: ${error.message}`);
    } else {
      navigate('/login')
    }
  };

  const displayName = otherUserProfile?.display_name ?? 'Loading...';

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-100 relative h-16">
        <div className="flex-1 min-w-0">
          <span className="font-medium truncate">{displayName}</span>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
          <h1 className="text-xl font-semibold text-center">Chatterbox</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Logout
        </button>
      </header>
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={messages} currentUser={currentUser} />
      </div>
      <div className="p-4 border-t border-gray-300 bg-gray-100">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;