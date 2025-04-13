import {useCallback} from 'react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { supabase } from '../supabaseClient';
import {useNavigate} from "react-router-dom";
import {useAutoScroll, useChatParticipants, useMessages} from '../hooks';

const ChatPage = () => {
  const navigate = useNavigate();
  const { currentUser, otherUserProfile } = useChatParticipants();
  const { messages } = useMessages(currentUser, otherUserProfile);
  const messagesEndRef = useAutoScroll(messages);
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
    }
  }, [currentUser, otherUserProfile]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if(error) {
      console.error("Sign out error:", error);
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
        <MessageList messages={messages} currentUser={currentUser} messagesEndRef={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-300 bg-gray-100">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;