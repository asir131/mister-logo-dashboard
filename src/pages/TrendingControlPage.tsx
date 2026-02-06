import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TrendingUp, Pin, MoveUp, MoveDown, X } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrendingControl } from '../store/slices/trendingControlSlice';
export function TrendingControlPage() {
  const [selectedSection, setSelectedSection] = useState<'unap-blast' | 'manual-pinned' | 'organic'>('unap-blast');
  const [topPage, setTopPage] = useState(1);
  const [manualPage, setManualPage] = useState(1);
  const [organicPage, setOrganicPage] = useState(1);
  const [userUblastsPage, setUserUblastsPage] = useState(1);
  const userUblastsLimit = 10;
  const dispatch = useAppDispatch();
  const {
    overview,
    officialBlasts,
    submissions,
    meta,
    loading,
    error,
  } = useAppSelector((state) => state.trendingControl);
  const topUblasts = overview?.top || [];
  const manualPinned = overview?.manual || [];
  const organicTrending = overview?.organic || [];
  const ublastCampaigns = officialBlasts || [];
  const approvedSubmissions = submissions || [];

  useEffect(() => {
    dispatch(fetchTrendingControl({ topPage, manualPage, organicPage }));
  }, [dispatch, topPage, manualPage, organicPage]);

  async function handlePin(postId: string) {
    const result = await apiRequest({
      path: '/api/admin/trending/manual',
      method: 'POST',
      body: { postId }
    });
    if (result.ok) dispatch(fetchTrendingControl({ topPage, manualPage, organicPage }));
  }

  async function handleUnpin(placementId: string) {
    const result = await apiRequest({
      path: `/api/admin/trending/manual/${placementId}`,
      method: 'DELETE'
    });
    if (result.ok) dispatch(fetchTrendingControl({ topPage, manualPage, organicPage }));
  }

  async function handleMove(placementId: string, nextPosition: number) {
    if (nextPosition < 1 || nextPosition > 16) return;
    const result = await apiRequest({
      path: `/api/admin/trending/manual/${placementId}`,
      method: 'PATCH',
      body: { position: nextPosition }
    });
    if (result.ok) dispatch(fetchTrendingControl({ topPage, manualPage, organicPage }));
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
  const userCreatedUblasts = ublastCampaigns.filter((blast) => blast.createdBy);
  const userUblastsTotalPages = Math.max(1, Math.ceil(userCreatedUblasts.length / userUblastsLimit));
  const userUblastsPaged = userCreatedUblasts.slice(
    (userUblastsPage - 1) * userUblastsLimit,
    userUblastsPage * userUblastsLimit,
  );

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
          <Button icon={Pin} onClick={() => dispatch(fetchTrendingControl({ topPage, manualPage, organicPage }))}>Refresh</Button>
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
      {!loading && <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>
            Page {selectedSection === 'unap-blast' ? meta.top.page : selectedSection === 'manual-pinned' ? meta.manual.page : meta.organic.page}
            {' '}of{' '}
            {selectedSection === 'unap-blast' ? meta.top.totalPages : selectedSection === 'manual-pinned' ? meta.manual.totalPages : meta.organic.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedSection === 'unap-blast') setTopPage(Math.max(1, topPage - 1));
                if (selectedSection === 'manual-pinned') setManualPage(Math.max(1, manualPage - 1));
                if (selectedSection === 'organic') setOrganicPage(Math.max(1, organicPage - 1));
              }}
              disabled={(selectedSection === 'unap-blast' && topPage <= 1) ||
                (selectedSection === 'manual-pinned' && manualPage <= 1) ||
                (selectedSection === 'organic' && organicPage <= 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedSection === 'unap-blast') setTopPage(Math.min(meta.top.totalPages, topPage + 1));
                if (selectedSection === 'manual-pinned') setManualPage(Math.min(meta.manual.totalPages, manualPage + 1));
                if (selectedSection === 'organic') setOrganicPage(Math.min(meta.organic.totalPages, organicPage + 1));
              }}
              disabled={(selectedSection === 'unap-blast' && topPage >= meta.top.totalPages) ||
                (selectedSection === 'manual-pinned' && manualPage >= meta.manual.totalPages) ||
                (selectedSection === 'organic' && organicPage >= meta.organic.totalPages)}
            >
              Next
            </Button>
          </div>
        </div>}

      {!loading && selectedSection === 'unap-blast' && <div className="bg-surface border border-slate-700 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            User-Created UBlasts
          </h3>
          {userCreatedUblasts.length === 0 ? <div className="text-sm text-text-secondary">
              No user-created UBlasts yet.
            </div> : <DataTable data={userUblastsPaged} columns={campaignColumns} actions={blast => <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={Pin} onClick={() => handlePin(blast._id)}>
                    Pin to Manual
                  </Button>
                </div>} />}
          {userCreatedUblasts.length > 0 && <div className="flex items-center justify-between text-sm text-text-secondary mt-3">
              <span>
                Page {userUblastsPage} of {userUblastsTotalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserUblastsPage((prev) => Math.max(1, prev - 1))}
                  disabled={userUblastsPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserUblastsPage((prev) => Math.min(userUblastsTotalPages, prev + 1))}
                  disabled={userUblastsPage >= userUblastsTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>}
        </div>}
    </div>;
}
