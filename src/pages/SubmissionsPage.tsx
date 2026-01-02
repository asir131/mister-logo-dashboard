import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { mockSubmissions } from '../utils/mockData';
import { Submission } from '../types';
import { CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
export function SubmissionsPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const columns: Column<Submission>[] = [{
    key: 'user',
    header: 'User',
    render: submission => <div className="flex items-center gap-3">
          <img src={submission.user.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-medium text-text-primary">
              {submission.user.name}
            </p>
            <p className="text-xs text-text-secondary">
              {submission.user.username}
            </p>
          </div>
        </div>
  }, {
    key: 'blast',
    header: 'UNAP Blast',
    render: submission => <div>
          <p className="font-medium text-text-primary">
            {submission.blastTitle}
          </p>
          <p className="text-xs text-text-secondary">
            ID: {submission.blastId}
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
    render: submission => new Date(submission.submittedAt).toLocaleString()
  }, {
    key: 'status',
    header: 'Status',
    render: submission => <StatusBadge status={submission.status} />
  }];
  const filteredSubmissions = mockSubmissions.filter(sub => filterStatus === 'all' || sub.status.toLowerCase() === filterStatus);
  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission);
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
            {mockSubmissions.filter(s => s.status === 'Pending').length}
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
            {mockSubmissions.filter(s => s.status === 'Approved').length}
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
            {mockSubmissions.filter(s => s.status === 'Rejected').length}
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
      <DataTable data={filteredSubmissions} columns={columns} actions={submission => <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleReview(submission)}>
              <Eye className="w-4 h-4" />
            </Button>
            {submission.status === 'Pending' && <>
                <Button variant="secondary" size="sm" icon={CheckCircle}>
                  Approve
                </Button>
                <Button variant="danger" size="sm" icon={XCircle}>
                  Reject
                </Button>
              </>}
          </div>} />

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Review Submission" size="lg">
        {selectedSubmission && <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
              <img src={selectedSubmission.user.avatar} alt="" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedSubmission.user.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {selectedSubmission.user.username}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                UNAP Blast
              </label>
              <p className="text-text-primary font-medium">
                {selectedSubmission.blastTitle}
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

            {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Attachments
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSubmission.attachments.map((url, idx) => <img key={idx} src={url} alt="" className="w-full h-32 object-cover rounded-lg" />)}
                  </div>
                </div>}

            <Input label="Admin Notes" placeholder="Add notes about this submission..." />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button variant="ghost" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" icon={XCircle}>
                Reject
              </Button>
              <Button icon={CheckCircle}>Approve</Button>
            </div>
          </div>}
      </Modal>
    </div>;
}