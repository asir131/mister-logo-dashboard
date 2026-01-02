import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { mockModerationActions, mockUsers, mockPosts } from '../utils/mockData';
import { ModerationAction } from '../types';
import { Shield, Ban, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
export function ModerationPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'history'>('users');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const userColumns: Column<any>[] = [{
    key: 'user',
    header: 'User',
    render: user => <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
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
          {post.thumbnail && <img src={post.thumbnail} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">{post.user.name}</p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {post.content}
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
    render: post => `${post.stats.views.toLocaleString()} views`
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
          <DataTable data={mockUsers} columns={userColumns} actions={user => <div className="flex gap-2">
                {user.status === 'Active' && <Button variant="secondary" size="sm">
                    Restrict
                  </Button>}
                {user.status === 'Restricted' && <Button variant="secondary" size="sm">
                    Unrestrict
                  </Button>}
                <Button variant="danger" size="sm">
                  Block
                </Button>
              </div>} />
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
          <DataTable data={mockPosts.filter(p => !p.isUnapBlast)} columns={postColumns} actions={post => <div className="flex gap-2">
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