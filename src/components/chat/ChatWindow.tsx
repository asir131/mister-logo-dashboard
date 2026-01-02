import React, { useEffect, useState, useRef } from 'react';
import { ChatSession } from '../../types';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';
interface ChatWindowProps {
  chat: ChatSession | null;
  onSendMessage: (text: string) => void;
}
export function ChatWindow({
  chat,
  onSendMessage
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  if (!chat) {
    return <div className="flex-1 flex items-center justify-center bg-background-start/50 text-text-secondary">
        Select a conversation to start chatting
      </div>;
  }
  return <div className="flex-1 flex flex-col h-full bg-background-start/30">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={chat.user.avatar} alt={chat.user.name} className="w-8 h-8 rounded-full" />
          <div>
            <h3 className="font-medium text-text-primary">{chat.user.name}</h3>
            <span className="text-xs text-text-secondary">
              @{chat.user.username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${chat.status === 'Open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : chat.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
            {chat.status}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map(msg => <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[70%] rounded-2xl px-4 py-3
              ${msg.isAdmin ? 'bg-primary text-white rounded-br-none' : 'bg-surface border border-slate-700 text-text-primary rounded-bl-none'}
            `}>
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] mt-1 block opacity-70 ${msg.isAdmin ? 'text-blue-100' : 'text-text-secondary'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-surface border-t border-slate-700">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {['How can I help?', 'Please check your email.', 'Issue resolved.'].map(quickReply => <button key={quickReply} onClick={() => setMessage(quickReply)} className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-text-secondary hover:bg-slate-700 hover:text-text-primary transition-colors">
              {quickReply}
            </button>)}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <button type="button" className="p-2 text-text-secondary hover:text-text-primary hover:bg-slate-800 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your reply..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <Button type="submit" disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>;
}