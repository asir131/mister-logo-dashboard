import React, { useState } from 'react';
import { UserList } from '../components/chat/UserList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { UserInfoPanel } from '../components/chat/UserInfoPanel';
import { mockChats } from '../utils/mockData';
export function SupportChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(mockChats[0].id);
  const activeChat = mockChats.find(c => c.id === activeChatId) || null;
  const handleSendMessage = (text: string) => {
    console.log('Sending message:', text);
    // In a real app, this would update the state/backend
  };
  return <div className="h-[calc(100vh-8rem)] bg-surface border border-slate-700 rounded-xl overflow-hidden flex fade-in">
      <UserList chats={mockChats} activeChatId={activeChatId} onSelectChat={setActiveChatId} />
      <ChatWindow chat={activeChat} onSendMessage={handleSendMessage} />
      <UserInfoPanel chat={activeChat} />
    </div>;
}