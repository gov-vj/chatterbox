import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { supabase } from '../supabaseClient';

const ChatPage = () => {
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

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-100">
        <h1 className="text-xl font-semibold">Chatterbox</h1>
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