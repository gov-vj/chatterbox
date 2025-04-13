import { useState, useEffect } from 'react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
}

const USER_ONE_EMAIL = import.meta.env.VITE_ALLOWED_USER_1_EMAIL;
const USER_TWO_EMAIL = import.meta.env.VITE_ALLOWED_USER_2_EMAIL;

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);

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
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handleLogout = async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if(error) {
      console.error("Sign out error:", error);
      alert(`Error signing out: ${error.message}`);
    } else {
      console.log('Signed out successfully.');
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
        <MessageList />
      </div>
      <div className="p-4 border-t border-gray-300 bg-gray-100">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;