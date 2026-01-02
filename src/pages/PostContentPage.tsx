import React, { useState } from 'react';
import { TabNavigation } from '../components/ui/TabNavigation';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { mockPosts } from '../utils/mockData';
import { Post } from '../types';
import { Eye, Heart, MessageCircle, Share2, MoreHorizontal, Instagram, Youtube, Music, Video } from 'lucide-react';
export function PostContentPage() {
  const [activeTab, setActiveTab] = useState('user-posts');
  const [searchTerm, setSearchTerm] = useState('');
  const platformIcons = {
    Instagram: Instagram,
    TikTok: Video,
    YouTube: Youtube,
    Spotify: Music
  };
  const columns: Column<Post>[] = [{
    key: 'user',
    header: 'User',
    render: post => <div className="flex items-center gap-3">
          <img src={post.user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <span className="font-medium">{post.user.name}</span>
        </div>
  }, {
    key: 'content',
    header: 'Content',
    render: post => <div className="flex items-center gap-3 max-w-xs">
          {post.thumbnail && <img src={post.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />}
          <p className="truncate text-text-secondary">{post.content}</p>
        </div>
  }, {
    key: 'type',
    header: 'Type',
    render: post => <span className="px-2 py-1 rounded bg-slate-800 text-xs text-text-secondary">
          {post.type}
        </span>
  }, {
    key: 'platforms',
    header: 'Platforms',
    render: post => <div className="flex gap-1">
          {post.platforms.map(p => {
        const Icon = platformIcons[p];
        return <Icon key={p} className="w-4 h-4 text-text-secondary" />;
      })}
        </div>
  }, {
    key: 'stats',
    header: 'Engagement',
    render: post => <div className="flex gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.stats.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {post.stats.likes}
          </span>
        </div>
  }, {
    key: 'status',
    header: 'Status',
    render: post => <StatusBadge status={post.status} type="post" />
  }];
  const filteredPosts = mockPosts.filter(post => {
    const matchesTab = activeTab === 'official' ? post.isOfficial : !post.isOfficial;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Post Content</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <SearchBar onSearch={setSearchTerm} className="w-full sm:w-64" />
        </div>
      </div>

      <TabNavigation tabs={[{
      id: 'user-posts',
      label: 'User Posts'
    }, {
      id: 'official',
      label: 'Official Posts'
    }]} activeTab={activeTab} onTabChange={setActiveTab} />

      <DataTable data={filteredPosts} columns={columns} actions={post => <Button variant="ghost" size="sm" className="!p-1">
            <MoreHorizontal className="w-4 h-4" />
          </Button>} />
    </div>;
}