import React from 'react';
import { ChatSession } from '../../types';
import { Mail, Phone, Instagram, Music, Video, Youtube } from 'lucide-react';
import { Select } from '../ui/Select';
interface UserInfoPanelProps {
  chat: ChatSession | null;
}
export function UserInfoPanel({
  chat
}: UserInfoPanelProps) {
  if (!chat) return null;
  const platformIcons = {
    Instagram: Instagram,
    TikTok: Video,
    YouTube: Youtube,
    Spotify: Music
  };
  return <div className="w-72 bg-surface border-l border-slate-700 p-6 hidden xl:block overflow-y-auto">
      <div className="text-center mb-6">
        <img src={chat.user.avatar} alt={chat.user.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-slate-800" />
        <h3 className="text-lg font-bold text-text-primary">
          {chat.user.name}
        </h3>
        <p className="text-sm text-text-secondary">@{chat.user.username}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">
            Issue Status
          </label>
          <Select options={[{
          value: 'Open',
          label: 'Open'
        }, {
          value: 'In Progress',
          label: 'In Progress'
        }, {
          value: 'Resolved',
          label: 'Resolved'
        }]} defaultValue={chat.status} />
        </div>

        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">
            Contact Info
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Mail className="w-4 h-4" />
              <span className="truncate">{chat.user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Phone className="w-4 h-4" />
              <span>{chat.user.phone}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">
            Linked Accounts
          </h4>
          <div className="flex gap-2">
            {chat.user.linkedPlatforms.map(platform => {
            const Icon = platformIcons[platform];
            return <div key={platform} className="p-2 bg-slate-800 rounded-lg text-text-secondary hover:text-primary transition-colors cursor-help" title={platform}>
                  <Icon className="w-4 h-4" />
                </div>;
          })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-lg font-bold text-text-primary">
                {chat.user.totalPosts}
              </p>
              <p className="text-xs text-text-secondary">Posts</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-lg font-bold text-text-primary">
                {(chat.user.followers / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-text-secondary">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}