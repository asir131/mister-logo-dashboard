import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { mockModerationActions } from '../utils/mockData';
import { ModerationAction } from '../types';
import { Shield, Ban, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
export function ModerationPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'history'>('users');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const usersLimit = 10;
  const postsLimit = 10;
  const userColumns: Column<any>[] = [{
    key: 'user',
    header: 'User',
    render: user => <div className="flex items-center gap-3">
          {user.avatar ? <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-text-secondary">
              {user.name?.[0] || 'U'}
            </div>}
          <div>
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary">{user.username}</p>
          </div>
        </div>
  }, {
    key: 'status',
    header: 'Status',
    render: user => <StatusBadge status={user.status} />
  }, {
    key: 'ublast',
    header: 'UBlast Block',
    render: user => <StatusBadge status={user.ublastBlocked ? 'Blocked' : 'Active'} />
  }, {
    key: 'followers',
    header: 'Followers',
    render: user => (user.followers / 1000).toFixed(1) + 'k'
  }, {
    key: 'lastActivity',
    header: 'Last Active'
  }];
  const postColumns: Column<any>[] = [{
    key: 'post',
    header: 'Post',
    render: post => <div className="flex items-center gap-3">
          {post.mediaUrl && <img src={post.mediaUrl} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">{post.user?.name}</p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {post.content || ''}
            </p>
          </div>
        </div>
  }, {
    key: 'status',
    header: 'Status',
    render: post => <StatusBadge status={post.status} type="post" />
  }, {
    key: 'stats',
    header: 'Engagement',
    render: post => `${post.stats?.views?.toLocaleString?.() || 0} views`
  }];
  const historyColumns: Column<ModerationAction>[] = [{
    key: 'action',
    header: 'Action',
    render: action => <div>
          <p className="font-medium text-text-primary capitalize">
            {action.type.replace('_', ' ')}
          </p>
          <p className="text-xs text-text-secondary">{action.targetType}</p>
        </div>
  }, {
    key: 'target',
    header: 'Target',
    render: action => <p className="text-sm text-text-primary">{action.targetName}</p>
  }, {
    key: 'reason',
    header: 'Reason',
    render: action => <p className="text-sm text-text-secondary truncate max-w-xs">
          {action.reason}
        </p>
  }, {
    key: 'performedBy',
    header: 'Performed By'
  }, {
    key: 'performedAt',
    header: 'Date',
    render: action => new Date(action.performedAt).toLocaleString()
  }];
  const handleAction = (actionType: string) => {
    setSelectedAction(actionType);
    setIsActionModalOpen(true);
  };

  async function loadUsers(page = 1) {
    setUsersLoading(true);
    setUsersError(null);
    const result = await apiRequest({
      path: `/api/admin/users?page=${page}&limit=${usersLimit}`
    });
    if (!result.ok) {
      setUsersError(result.data?.error || 'Failed to load users.');
      setUsersLoading(false);
      return;
    }
    setUsers(result.data?.users || []);
    setUsersPage(result.data?.page || 1);
    setUsersTotalPages(result.data?.totalPages || 1);
    setUsersLoading(false);
  }

  async function updateUserRestriction(userId: string, action: 'restrict' | 'unrestrict') {
    const result = await apiRequest({
      path: `/api/admin/users/${userId}/${action}`,
      method: 'PATCH'
    });
    if (!result.ok) {
      setUsersError(result.data?.error || 'Failed to update user.');
      return;
    }
    setUsers(prev => prev.map(user => user.id === userId ? {
      ...user,
      status: result.data.status || user.status,
      ublastBlocked: typeof result.data.ublastBlocked === 'boolean'
        ? result.data.ublastBlocked
        : user.ublastBlocked,
      ublastBlockedUntil: result.data.ublastBlockedUntil ?? user.ublastBlockedUntil
    } : user));
  }

  async function loadPosts(page = 1) {
    setPostsLoading(true);
    setPostsError(null);
    const result = await apiRequest({
      path: `/api/admin/posts?page=${page}&limit=${postsLimit}`
    });
    if (!result.ok) {
      setPostsError(result.data?.error || 'Failed to load posts.');
      setPostsLoading(false);
      return;
    }
    setPosts(result.data?.posts || []);
    setPostsPage(result.data?.page || 1);
    setPostsTotalPages(result.data?.totalPages || 1);
    setPostsLoading(false);
  }

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(usersPage);
    }
    if (activeTab === 'posts') {
      loadPosts(postsPage);
    }
  }, [activeTab, usersPage, postsPage]);
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Moderation Center
          </h1>
          <p className="text-text-secondary mt-1">
            Manage user accounts and content moderation.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-500 mb-1">
            Moderation Actions Are Permanent
          </h3>
          <p className="text-sm text-text-secondary">
            All moderation actions are logged and cannot be undone. Please
            review carefully before taking action.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-slate-700">
        {[{
        id: 'users',
        label: 'User Moderation',
        icon: Shield
      }, {
        id: 'posts',
        label: 'Post Moderation',
        icon: Shield
      }, {
        id: 'history',
        label: 'Action History',
        icon: Shield
      }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>)}
      </div>

      {/* User Moderation Tab */}
      {activeTab === 'users' && <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="secondary" icon={Ban} onClick={() => handleAction('restrict')}>
              Restrict User
            </Button>
            <Button variant="secondary" icon={CheckCircle} onClick={() => handleAction('unrestrict')}>
              Unrestrict User
            </Button>
            <Button variant="danger" icon={Ban} onClick={() => handleAction('block')}>
              Block User
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => handleAction('delete')}>
              Delete User
            </Button>
          </div>
          {usersError && <div className="text-sm text-red-400">{usersError}</div>}
          {usersLoading && <div className="text-sm text-text-secondary">Loading users...</div>}
          <DataTable data={users} columns={userColumns} actions={user => <div className="flex gap-2">
                {!user.ublastBlocked && <Button variant="secondary" size="sm" onClick={() => updateUserRestriction(user.id, 'restrict')}>
                    Restrict
                  </Button>}
                {user.ublastBlocked && <Button variant="secondary" size="sm" onClick={() => updateUserRestriction(user.id, 'unrestrict')}>
                    Unrestrict
                  </Button>}
              </div>} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {usersPage} of {usersTotalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setUsersPage(prev => Math.max(1, prev - 1))} disabled={usersPage <= 1 || usersLoading}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setUsersPage(prev => Math.min(usersTotalPages, prev + 1))} disabled={usersPage >= usersTotalPages || usersLoading}>
                Next
              </Button>
            </div>
          </div>
        </>}

      {/* Post Moderation Tab */}
      {activeTab === 'posts' && <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="danger" icon={Ban} onClick={() => handleAction('remove_post')}>
              Remove Post
            </Button>
            <Button variant="secondary" icon={CheckCircle} onClick={() => handleAction('restore_post')}>
              Restore Post
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => handleAction('delete_post')}>
              Permanently Delete
            </Button>
          </div>
          {postsError && <div className="text-sm text-red-400">{postsError}</div>}
          {postsLoading && <div className="text-sm text-text-secondary">Loading posts...</div>}
          <DataTable data={posts} columns={postColumns} actions={post => <div className="flex gap-2">
                {post.status === 'Active' && <Button variant="danger" size="sm">
                    Remove
                  </Button>}
                {post.status === 'Removed' && <Button variant="secondary" size="sm">
                    Restore
                  </Button>}
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {postsPage} of {postsTotalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPostsPage(prev => Math.max(1, prev - 1))} disabled={postsPage <= 1 || postsLoading}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPostsPage(prev => Math.min(postsTotalPages, prev + 1))} disabled={postsPage >= postsTotalPages || postsLoading}>
                Next
              </Button>
            </div>
          </div>
        </>}

      {/* Action History Tab */}
      {activeTab === 'history' && <DataTable data={mockModerationActions} columns={historyColumns} />}

      {/* Action Confirmation Modal */}
      <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} title={`Confirm ${selectedAction.replace('_', ' ').toUpperCase()}`} size="md">
        <div className="space-y-6">
          <div className="bg-error-bg border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-error-text">
              This action will be logged and may have permanent consequences.
              Please provide a reason.
            </p>
          </div>

          <Input label="Reason for Action" placeholder="Enter reason..." />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]" placeholder="Add any additional context..."></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger">Confirm Action</Button>
          </div>
        </div>
      </Modal>
    </div>;
}
