import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockPosts } from '../utils/mockData';
import { Post } from '../types';
import { TrendingUp, Pin, MoveUp, MoveDown, X } from 'lucide-react';
export function TrendingControlPage() {
  const [selectedSection, setSelectedSection] = useState<'unap-blast' | 'manual-pinned' | 'organic'>('unap-blast');
  const unapBlasts = mockPosts.filter(p => p.isUnapBlast && p.trendingSection === 'unap-blast');
  const manualPinned = mockPosts.filter(p => p.trendingSection === 'manual-pinned');
  const organicTrending = mockPosts.filter(p => p.trendingSection === 'organic');
  const columns: Column<Post>[] = [{
    key: 'position',
    header: 'Position',
    render: post => <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            #{post.trendingPosition}
          </span>
        </div>
  }, {
    key: 'content',
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
    key: 'stats',
    header: 'Engagement',
    render: post => <div className="space-y-1">
          <div className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              {post.stats.views.toLocaleString()}
            </span>{' '}
            views
          </div>
          <div className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              {post.stats.likes.toLocaleString()}
            </span>{' '}
            likes
          </div>
        </div>
  }, {
    key: 'section',
    header: 'Section',
    render: post => {
      const sectionLabels = {
        'unap-blast': 'UNAP Blast',
        'manual-pinned': 'Pinned',
        organic: 'Organic'
      };
      return <StatusBadge status={sectionLabels[post.trendingSection!]} />;
    }
  }];
  const getSectionData = () => {
    switch (selectedSection) {
      case 'unap-blast':
        return unapBlasts;
      case 'manual-pinned':
        return manualPinned;
      case 'organic':
        return organicTrending;
      default:
        return [];
    }
  };
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Trending Control
          </h1>
          <p className="text-text-secondary mt-1">
            Manage trending page sections and post positioning.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary-gradient/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Trending Page Structure
            </h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>
                <strong className="text-text-primary">Top Section:</strong> UNAP
                Blasts automatically appear at the top (stays for 24 hours)
              </p>
              <p>
                <strong className="text-text-primary">Manual Slots:</strong>{' '}
                Limited pinned positions for admin-selected posts
              </p>
              <p>
                <strong className="text-text-primary">Organic:</strong> Posts
                ranked by engagement (views, likes, shares, comments)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <button onClick={() => setSelectedSection('unap-blast')} className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${selectedSection === 'unap-blast' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-surface border border-slate-700 text-text-secondary hover:text-text-primary hover:border-primary/50'}`}>
          UNAP Blasts ({unapBlasts.length})
        </button>
        <button onClick={() => setSelectedSection('manual-pinned')} className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${selectedSection === 'manual-pinned' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-surface border border-slate-700 text-text-secondary hover:text-text-primary hover:border-primary/50'}`}>
          Manual Pinned ({manualPinned.length}/5)
        </button>
        <button onClick={() => setSelectedSection('organic')} className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${selectedSection === 'organic' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-surface border border-slate-700 text-text-secondary hover:text-text-primary hover:border-primary/50'}`}>
          Organic Trending ({organicTrending.length})
        </button>
      </div>

      {/* Actions Bar */}
      {selectedSection === 'manual-pinned' && <div className="bg-surface border border-slate-700 rounded-lg p-4 flex justify-between items-center">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">
              {manualPinned.length} of 5
            </strong>{' '}
            manual slots used
          </p>
          <Button icon={Pin}>Pin Post to Trending</Button>
        </div>}

      {/* Data Table */}
      <DataTable data={getSectionData()} columns={columns} actions={post => <div className="flex gap-2">
            {selectedSection === 'manual-pinned' && <>
                <Button variant="ghost" size="sm" title="Move Up">
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Move Down">
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" title="Unpin">
                  <X className="w-4 h-4" />
                </Button>
              </>}
            {selectedSection === 'organic' && <Button variant="secondary" size="sm" icon={Pin}>
                Pin to Manual
              </Button>}
          </div>} />
    </div>;
}