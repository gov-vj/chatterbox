const MessageList = () => {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-500 italic">
        Message list area. Messages will appear here soon!
      </p>
      <div className="flex justify-start">
        <div className="bg-gray-300 text-black py-2 px-4 rounded-lg max-w-xs">
          Hello there! (Other user)
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white py-2 px-4 rounded-lg max-w-xs">
          Hi! How are you? (You)
        </div>
      </div>
    </div>
  );
};

export default MessageList;