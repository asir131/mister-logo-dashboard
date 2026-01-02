import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { mockUsers } from '../utils/mockData';
import { User } from '../types';
import { Instagram, Youtube, Music, Video, MoreHorizontal } from 'lucide-react';
export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const platformIcons = {
    Instagram: Instagram,
    TikTok: Video,
    YouTube: Youtube,
    Spotify: Music
  };
  const columns: Column<User>[] = [{
    key: 'name',
    header: 'User',
    render: user => <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium text-text-primary">{user.name}</div>
            <div className="text-xs text-text-secondary">{user.username}</div>
          </div>
        </div>
  }, {
    key: 'contact',
    header: 'Contact',
    render: user => <div className="text-sm text-text-secondary">
          <div>{user.email}</div>
          <div className="text-xs">{user.phone}</div>
        </div>
  }, {
    key: 'linkedPlatforms',
    header: 'Platforms',
    render: user => <div className="flex gap-2">
          {user.linkedPlatforms.map(p => {
        const Icon = platformIcons[p];
        return <div key={p} className="p-1.5 bg-slate-800 rounded text-text-secondary">
                <Icon className="w-3 h-3" />
              </div>;
      })}
        </div>
  }, {
    key: 'followers',
    header: 'Followers',
    render: user => (user.followers / 1000).toFixed(1) + 'k',
    sortable: true
  }, {
    key: 'status',
    header: 'Status',
    render: user => <StatusBadge status={user.status} />
  }, {
    key: 'lastActivity',
    header: 'Last Active'
  }];
  const filteredUsers = mockUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage creators and influencers.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <SearchBar onSearch={setSearchTerm} className="w-full sm:w-64" />
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="bg-surface border border-slate-700 rounded-lg p-4 flex gap-4 overflow-x-auto">
        {/* Quick Filters */}
        {['All', 'Active', 'Restricted', 'Suspended'].map(status => <button key={status} className="px-4 py-2 rounded-full bg-slate-800 text-sm font-medium text-text-secondary hover:bg-slate-700 hover:text-text-primary transition-colors whitespace-nowrap">
            {status}
          </button>)}
      </div>

      <DataTable data={filteredUsers} columns={columns} actions={user => <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>} />
    </div>;
}