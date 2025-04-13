import { DbMessage } from '../types';
import { User } from '@supabase/supabase-js';

interface MessageListProps {
  messages: DbMessage[];
  currentUser: User | null;
}

const MessageList = ({ messages, currentUser }: MessageListProps) => {
  if (messages.length === 0 || !currentUser) {
    return <p className="text-center text-gray-500 italic">No messages yet. Start the conversation!</p>;
  }
  return (
    <div className="space-y-2">
      {messages.map((message) => {
        const isCurrentUserSender = message.sender_id === currentUser.id;
        const messageClass = isCurrentUserSender ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black';
        return (
          <div key={message.id} className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`${messageClass} py-2 px-4 rounded-lg max-w-xs lg:max-w-md break-words`}>
              {message.message}
            </div>
          </div>
        )})}
    </div>
  );
};

export default MessageList;