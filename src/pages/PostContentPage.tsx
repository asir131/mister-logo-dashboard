import React, { useEffect, useMemo, useState } from 'react';
import { TabNavigation } from '../components/ui/TabNavigation';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { apiRequest } from '../utils/apiClient';
import { Eye, Heart, MessageCircle, Share2, MoreHorizontal, Instagram, Youtube, Music, Video } from 'lucide-react';

type AdminPostRow = {
  id: string;
  userId: string;
  user: { id?: string; name: string; avatar?: string };
  content: string;
  mediaType: string;
  platforms: string[];
  stats: { views: number; likes: number; comments: number };
  status: string;
  createdAt: string;
};

type OfficialPostRow = {
  id: string;
  title: string;
  content: string;
  mediaType: string;
  status: string;
  createdAt: string;
  createdBy: string;
};

type EngagementResponse = {
  likes: number;
  views: number;
  comments: number;
  shares: number;
  sharedPosts: { userId: string; createdAt: string }[];
  page: number;
  totalPages: number;
  totalCount: number;
};
export function PostContentPage() {
  const [activeTab, setActiveTab] = useState('user-posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPosts, setUserPosts] = useState<AdminPostRow[]>([]);
  const [officialPosts, setOfficialPosts] = useState<OfficialPostRow[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [officialPage, setOfficialPage] = useState(1);
  const [officialTotalPages, setOfficialTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [engagementOpen, setEngagementOpen] = useState(false);
  const [activeOfficial, setActiveOfficial] = useState<OfficialPostRow | null>(null);
  const [engagements, setEngagements] = useState<EngagementResponse | null>(null);
  const [engagementPage, setEngagementPage] = useState(1);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const platformIcons = {
    Instagram: Instagram,
    TikTok: Video,
    YouTube: Youtube,
    Spotify: Music
  };
  const userColumns: Column<AdminPostRow>[] = [{
    key: 'user',
    header: 'User',
    render: post => <div className="flex items-center gap-3">
          {post.user.avatar && <img src={post.user.avatar} alt="" className="w-8 h-8 rounded-full" />}
          <div>
            <div className="font-medium">{post.user.name}</div>
            <div className="text-xs text-text-secondary">{post.userId}</div>
          </div>
        </div>
  }, {
    key: 'content',
    header: 'Content',
    render: post => <div className="flex items-center gap-3 max-w-xs">
          <p className="truncate text-text-secondary">{post.content}</p>
        </div>
  }, {
    key: 'type',
    header: 'Type',
    render: post => <span className="px-2 py-1 rounded bg-slate-800 text-xs text-text-secondary">
          {post.mediaType}
        </span>
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

  const officialColumns: Column<OfficialPostRow>[] = [{
    key: 'user',
    header: 'User',
    render: post => <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-text-secondary">
            A
          </div>
          <span className="font-medium">{post.createdBy}</span>
        </div>
  }, {
    key: 'content',
    header: 'Content',
    render: post => <div className="flex items-center gap-3 max-w-xs">
          <p className="truncate text-text-secondary">{post.content || post.title}</p>
        </div>
  }, {
    key: 'type',
    header: 'Type',
    render: post => <span className="px-2 py-1 rounded bg-slate-800 text-xs text-text-secondary">
          {post.mediaType}
        </span>
  }, {
    key: 'stats',
    header: 'Engagement',
    render: post => <button className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary" onClick={e => {
          e.stopPropagation();
          openEngagement(post);
        }}>
          <Share2 className="w-3 h-3" /> View
        </button>
  }, {
    key: 'status',
    header: 'Status',
    render: post => <StatusBadge status={post.status} type="post" />
  }];

  const filteredUserPosts = useMemo(() => {
    return userPosts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || post.userId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [userPosts, searchTerm]);

  const filteredOfficialPosts = useMemo(() => {
    return officialPosts.filter(post => {
      const text = `${post.title} ${post.content} ${post.createdBy}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [officialPosts, searchTerm]);

  async function loadUserPosts(page: number) {
    setLoading(true);
    const result = await apiRequest({
      path: `/api/admin/posts?page=${page}&limit=15`
    });
    setLoading(false);
    if (!result.ok) return;
    setUserPosts(result.data.posts || []);
    setUserPage(result.data.page || 1);
    setUserTotalPages(result.data.totalPages || 1);
  }

  async function loadOfficialPosts(page: number) {
    setLoading(true);
    const result = await apiRequest({
      path: `/api/admin/official-posts?page=${page}&limit=15`
    });
    setLoading(false);
    if (!result.ok) return;
    setOfficialPosts(result.data.ublasts || []);
    setOfficialPage(result.data.page || 1);
    setOfficialTotalPages(result.data.totalPages || 1);
  }

  async function loadEngagements(ublastId: string, page: number) {
    setEngagementLoading(true);
    const result = await apiRequest({
      path: `/api/admin/official-posts/${ublastId}/engagements?page=${page}&limit=10`
    });
    setEngagementLoading(false);
    if (!result.ok) return;
    setEngagements(result.data as EngagementResponse);
    setEngagementPage(result.data.page || 1);
  }

  function openEngagement(post: OfficialPostRow) {
    setActiveOfficial(post);
    setEngagementOpen(true);
    setEngagements(null);
    loadEngagements(post.id, 1);
  }

  useEffect(() => {
    if (activeTab === 'official') {
      loadOfficialPosts(officialPage);
    } else {
      loadUserPosts(userPage);
    }
  }, [activeTab]);

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

      {activeTab === 'user-posts' ? <div className="space-y-4">
          <DataTable data={filteredUserPosts} columns={userColumns} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Page {userPage} of {userTotalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => loadUserPosts(Math.max(1, userPage - 1))} disabled={userPage <= 1 || loading}>
                Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={() => loadUserPosts(Math.min(userTotalPages, userPage + 1))} disabled={userPage >= userTotalPages || loading}>
                Next
              </Button>
            </div>
          </div>
        </div> : <div className="space-y-4">
          <DataTable data={filteredOfficialPosts} columns={officialColumns} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Page {officialPage} of {officialTotalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => loadOfficialPosts(Math.max(1, officialPage - 1))} disabled={officialPage <= 1 || loading}>
                Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={() => loadOfficialPosts(Math.min(officialTotalPages, officialPage + 1))} disabled={officialPage >= officialTotalPages || loading}>
                Next
              </Button>
            </div>
          </div>
        </div>}

      <Modal isOpen={engagementOpen} onClose={() => setEngagementOpen(false)} title="Official Post Engagement" size="lg">
        {activeOfficial && <div className="space-y-4">
            <div>
              <div className="text-sm text-text-secondary">UBlast</div>
              <div className="font-semibold text-text-primary">{activeOfficial.title}</div>
              <div className="text-sm text-text-secondary">{activeOfficial.content}</div>
            </div>
            {engagementLoading && <div className="text-text-secondary">Loading engagement...</div>}
            {engagements && <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-800/60 p-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Eye className="w-4 h-4" /> Views
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{engagements.views}</div>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Heart className="w-4 h-4" /> Likes
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{engagements.likes}</div>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MessageCircle className="w-4 h-4" /> Comments
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{engagements.comments}</div>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Share2 className="w-4 h-4" /> Shares
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{engagements.shares}</div>
                </div>
              </div>}
            {engagements && <div className="space-y-2">
                <div className="text-sm text-text-secondary">Shared Posts (paginated)</div>
                <div className="rounded-lg border border-slate-700">
                  <div className="divide-y divide-slate-700">
                    {engagements.sharedPosts.length > 0 ? engagements.sharedPosts.map((share, index) => <div key={`${share.userId}-${index}`} className="flex items-center justify-between px-4 py-2 text-sm">
                          <span className="text-text-primary">{share.userId}</span>
                          <span className="text-text-secondary">{new Date(share.createdAt).toLocaleString()}</span>
                        </div>) : <div className="px-4 py-6 text-text-secondary text-sm text-center">
                        No shares yet.
                      </div>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Page {engagements.page} of {engagements.totalPages}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => loadEngagements(activeOfficial.id, Math.max(1, engagementPage - 1))} disabled={engagementPage <= 1 || engagementLoading}>
                      Prev
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => loadEngagements(activeOfficial.id, Math.min(engagements.totalPages, engagementPage + 1))} disabled={engagementPage >= engagements.totalPages || engagementLoading}>
                      Next
                    </Button>
                  </div>
                </div>
              </div>}
          </div>}
      </Modal>
    </div>;
}
