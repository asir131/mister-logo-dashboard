import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
export function SubmissionsPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const columns: Column<any>[] = [{
    key: 'user',
    header: 'User',
    render: submission => <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs text-text-secondary">
            {(submission.userId?.name || 'U')[0]}
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {submission.userId?.name || 'Unknown'}
            </p>
            <p className="text-xs text-text-secondary">
              {submission.userId?.email || 'N/A'}
            </p>
          </div>
        </div>
  }, {
    key: 'blast',
    header: 'UNAP Blast',
    render: submission => <div>
          <p className="font-medium text-text-primary">
            {submission.ublastId?.title || 'Untitled'}
          </p>
          <p className="text-xs text-text-secondary">
            ID: {submission.ublastId?._id || submission.ublastId}
          </p>
        </div>
  }, {
    key: 'content',
    header: 'Submission',
    render: submission => <div className="max-w-xs">
          <p className="text-sm text-text-secondary truncate">
            {submission.content}
          </p>
          {submission.attachments && submission.attachments.length > 0 && <p className="text-xs text-primary mt-1">
              {submission.attachments.length} attachment(s)
            </p>}
        </div>
  }, {
    key: 'submittedAt',
    header: 'Submitted',
    render: submission => new Date(submission.createdAt).toLocaleString()
  }, {
    key: 'status',
    header: 'Status',
    render: submission => <StatusBadge status={submission.status?.replace(/^\w/, (c: string) => c.toUpperCase())} />
  }];
  const filteredSubmissions = submissions.filter(sub => filterStatus === 'all' || sub.status === filterStatus);

  useEffect(() => {
    loadSubmissions();
  }, [filterStatus]);

  async function loadSubmissions() {
    setLoading(true);
    setError(null);
    const statusParam = filterStatus === 'all' ? '' : `?status=${filterStatus}`;
    const result = await apiRequest({ path: `/api/admin/ublasts/submissions${statusParam}` });
    if (!result.ok) {
      setError(result.data?.error || 'Failed to load submissions.');
      setLoading(false);
      return;
    }
    setSubmissions(result.data.submissions || []);
    setLoading(false);
  }

  async function handleDecision(submissionId: string, status: 'approved' | 'rejected', notes?: string) {
    const result = await apiRequest({
      path: `/api/admin/ublasts/submissions/${submissionId}`,
      method: 'PATCH',
      body: { status, reviewNotes: notes }
    });
    if (result.ok) {
      setIsReviewModalOpen(false);
      loadSubmissions();
    }
  }
  const handleReview = (submission: any) => {
    setSelectedSubmission(submission);
    setReviewNotes(submission.reviewNotes || '');
    setIsReviewModalOpen(true);
  };
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Submission Review
          </h1>
          <p className="text-text-secondary mt-1">
            Review and approve user submissions for UNAP Blasts.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Pending Review
            </h3>
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {submissions.filter(s => s.status === 'pending').length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Approved
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {submissions.filter(s => s.status === 'approved').length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Rejected
            </h3>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {submissions.filter(s => s.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-slate-700 rounded-lg p-4 flex gap-4 overflow-x-auto">
        {['all', 'pending', 'approved', 'rejected'].map(status => <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status ? 'bg-primary text-white' : 'bg-slate-800 text-text-secondary hover:bg-slate-700 hover:text-text-primary'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>)}
      </div>

      {/* Submissions Table */}
      {loading && <div className="text-text-secondary">Loading submissions...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {!loading && <DataTable data={filteredSubmissions} columns={columns} actions={submission => <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleReview(submission)}>
              <Eye className="w-4 h-4" />
            </Button>
            {submission.status === 'pending' && <>
                <Button variant="secondary" size="sm" icon={CheckCircle} onClick={() => handleDecision(submission._id, 'approved')}>
                  Approve
                </Button>
                <Button variant="danger" size="sm" icon={XCircle} onClick={() => handleDecision(submission._id, 'rejected')}>
                  Reject
                </Button>
              </>}
          </div>} />}

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Review Submission" size="lg">
        {selectedSubmission && <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-sm text-text-secondary">
                {(selectedSubmission.userId?.name || 'U')[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedSubmission.userId?.name || 'Unknown'}
                </h3>
                <p className="text-sm text-text-secondary">
                  {selectedSubmission.userId?.email || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                UNAP Blast
              </label>
              <p className="text-text-primary font-medium">
                {selectedSubmission.ublastId?.title || 'Untitled'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Submission Content
              </label>
              <div className="bg-slate-800/50 rounded-lg p-4 text-text-primary">
                {selectedSubmission.content}
              </div>
            </div>

            {selectedSubmission.mediaUrl && <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Attachments
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <img src={selectedSubmission.mediaUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>}

            <Input label="Admin Notes" placeholder="Add notes about this submission..." value={reviewNotes} onChange={event => setReviewNotes(event.target.value)} />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button variant="ghost" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" icon={XCircle} onClick={() => handleDecision(selectedSubmission._id, 'rejected', reviewNotes)}>
                Reject
              </Button>
              <Button icon={CheckCircle} onClick={() => handleDecision(selectedSubmission._id, 'approved', reviewNotes)}>
                Approve
              </Button>
            </div>
          </div>}
      </Modal>
    </div>;
}
