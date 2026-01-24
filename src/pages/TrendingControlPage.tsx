import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TrendingUp, Pin, MoveUp, MoveDown, X } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
export function TrendingControlPage() {
  const [selectedSection, setSelectedSection] = useState<'unap-blast' | 'manual-pinned' | 'organic'>('unap-blast');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topUblasts, setTopUblasts] = useState<any[]>([]);
  const [manualPinned, setManualPinned] = useState<any[]>([]);
  const [organicTrending, setOrganicTrending] = useState<any[]>([]);
  const [ublastCampaigns, setUblastCampaigns] = useState<any[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<any[]>([]);

  useEffect(() => {
    loadTrending();
  }, []);

  async function loadTrending() {
    setLoading(true);
    setError(null);
    const [trendResult, ublastsResult, submissionsResult] = await Promise.all([
      apiRequest({ path: '/api/admin/trending/overview' }),
      apiRequest({ path: '/api/admin/ublasts' }),
      apiRequest({ path: '/api/admin/ublasts/submissions?status=approved' })
    ]);
    if (!trendResult.ok) {
      setError(trendResult.data?.error || 'Failed to load trending data.');
      setLoading(false);
      return;
    }
    setTopUblasts(trendResult.data.top || []);
    setManualPinned(trendResult.data.manual || []);
    setOrganicTrending(trendResult.data.organic || []);
    if (ublastsResult.ok) {
      setUblastCampaigns(ublastsResult.data.ublasts || []);
    }
    if (submissionsResult.ok) {
      setApprovedSubmissions(submissionsResult.data.submissions || []);
    }
    setLoading(false);
  }

  async function handlePin(postId: string) {
    const result = await apiRequest({
      path: '/api/admin/trending/manual',
      method: 'POST',
      body: { postId }
    });
    if (result.ok) loadTrending();
  }

  async function handleUnpin(placementId: string) {
    const result = await apiRequest({
      path: `/api/admin/trending/manual/${placementId}`,
      method: 'DELETE'
    });
    if (result.ok) loadTrending();
  }

  async function handleMove(placementId: string, nextPosition: number) {
    if (nextPosition < 1 || nextPosition > 16) return;
    const result = await apiRequest({
      path: `/api/admin/trending/manual/${placementId}`,
      method: 'PATCH',
      body: { position: nextPosition }
    });
    if (result.ok) loadTrending();
  }

  const ublastColumns: Column<any>[] = [{
    key: 'content',
    header: 'UBlast Post',
    render: post => <div className="flex items-center gap-3">
          {post.mediaUrl && <img src={post.mediaUrl} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">UBlast</p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {post.description || 'No description'}
            </p>
          </div>
        </div>
  }, {
    key: 'createdAt',
    header: 'Created',
    render: post => new Date(post.createdAt).toLocaleString()
  }, {
    key: 'status',
    header: 'Status',
    render: () => <StatusBadge status="UNAP Blast" />
  }];

  const approvedByUblastId = new Map(
    approvedSubmissions
      .filter((submission) => submission.approvedUblastId)
      .map((submission) => [submission.approvedUblastId.toString(), submission]),
  );

  function resolveScheduledFor(blast: any) {
    if (blast.scheduledFor) return blast.scheduledFor;
    const submission = approvedByUblastId.get(blast._id?.toString?.() || '');
    return submission?.proposedDate || null;
  }

  const campaignColumns: Column<any>[] = [{
    key: 'title',
    header: 'UBlast',
    render: blast => <div className="flex items-center gap-3">
          {blast.mediaUrl && <img src={blast.mediaUrl} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">
              {blast.title || 'Untitled'}
            </p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {blast.content || 'No content'}
            </p>
          </div>
        </div>
  }, {
    key: 'status',
    header: 'Status',
    render: blast => <StatusBadge status={blast.status} />
  }, {
    key: 'scheduledFor',
    header: 'Scheduled For',
    render: blast => {
      const scheduledFor = resolveScheduledFor(blast);
      return scheduledFor ? new Date(scheduledFor).toLocaleString() : 'N/A';
    }
  }, {
    key: 'createdBy',
    header: 'Created By',
    render: blast => blast.createdBy ? `User ${blast.createdBy}` : 'Admin'
  }];

  const postColumns: Column<any>[] = [{
    key: 'content',
    header: 'Post',
    render: item => {
      const post = item.post || item;
      return <div className="flex items-center gap-3">
          {post.mediaUrl && <img src={post.mediaUrl} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">Post</p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {post.description || 'No description'}
            </p>
          </div>
        </div>;
    }
  }, {
    key: 'createdAt',
    header: 'Created',
    render: item => {
      const post = item.post || item;
      return new Date(post.createdAt).toLocaleString();
    }
  }];
  const getSectionData = () => {
    switch (selectedSection) {
      case 'unap-blast':
        return topUblasts;
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
          UNAP Blasts ({topUblasts.length})
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
              {manualPinned.length} of 16
            </strong>{' '}
            manual slots used
          </p>
          <Button icon={Pin} onClick={loadTrending}>Refresh</Button>
        </div>}

      {/* Data Table */}
      {loading && <div className="text-text-secondary">Loading trending data...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {!loading && <DataTable data={getSectionData()} columns={selectedSection === 'unap-blast' ? ublastColumns : postColumns} actions={item => <div className="flex gap-2">
            {selectedSection === 'manual-pinned' && <>
                <Button variant="ghost" size="sm" title="Move Up" onClick={() => handleMove(item.placementId, item.position - 1)}>
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Move Down" onClick={() => handleMove(item.placementId, item.position + 1)}>
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" title="Unpin" onClick={() => handleUnpin(item.placementId)}>
                  <X className="w-4 h-4" />
                </Button>
              </>}
            {selectedSection === 'organic' && <Button variant="secondary" size="sm" icon={Pin} onClick={() => handlePin(item._id)}>
                Pin to Manual
              </Button>}
            {selectedSection === 'unap-blast' && <Button variant="secondary" size="sm" icon={Pin} onClick={() => handlePin(item._id)}>
                Pin to Manual
              </Button>}
          </div>} />}

      {!loading && selectedSection === 'unap-blast' && <div className="bg-surface border border-slate-700 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            User-Created UBlasts
          </h3>
          {ublastCampaigns.filter((blast) => blast.createdBy).length === 0 ? <div className="text-sm text-text-secondary">
              No user-created UBlasts yet.
            </div> : <DataTable data={ublastCampaigns.filter((blast) => blast.createdBy)} columns={campaignColumns} actions={blast => <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={Pin} onClick={() => handlePin(blast._id)}>
                    Pin to Manual
                  </Button>
                </div>} />}
        </div>}
    </div>;
}
