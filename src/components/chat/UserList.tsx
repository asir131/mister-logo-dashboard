import React from 'react';
import { ChatSession } from '../../types';
interface UserListProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}
export function UserList({
  chats,
  activeChatId,
  onSelectChat
}: UserListProps) {
  return <div className="flex flex-col h-full bg-surface border-r border-slate-700 w-80">
      <div className="p-4 border-b border-slate-700">
        <h2 className="font-semibold text-text-primary">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => <button key={chat.id} onClick={() => onSelectChat(chat.id)} className={`
              w-full p-4 flex items-start gap-3 border-b border-slate-800 transition-colors text-left
              ${activeChatId === chat.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}
            `}>
            <div className="relative">
              <img src={chat.user.avatar} alt={chat.user.name} className="w-10 h-10 rounded-full object-cover" />
              {chat.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                  {chat.unreadCount}
                </span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-medium text-text-primary truncate">
                  {chat.user.name}
                </span>
                <span className="text-xs text-text-secondary">
                  {chat.lastMessageTime}
                </span>
              </div>
              <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </button>)}
      </div>
    </div>;
}