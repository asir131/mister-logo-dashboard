import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Calendar, Edit, Trash2, Send } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
export function BlastSchedulingPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [scheduledBlasts, setScheduledBlasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    scheduledFor: '',
    media: null as File | null
  });

  useEffect(() => {
    loadBlasts();
  }, []);

  async function loadBlasts() {
    setLoading(true);
    setError(null);
    const result = await apiRequest({ path: '/api/admin/ublasts' });
    if (!result.ok) {
      setError(result.data?.error || 'Failed to load blasts.');
      setLoading(false);
      return;
    }
    setScheduledBlasts(result.data.ublasts || []);
    setLoading(false);
  }

  async function handleCreateBlast() {
    const formData = new FormData();
    formData.append('title', form.title);
    if (form.content) formData.append('content', form.content);
    if (form.scheduledFor) formData.append('scheduledFor', form.scheduledFor);
    if (form.media) formData.append('media', form.media);

    const result = await apiRequest({
      path: '/api/admin/ublasts',
      method: 'POST',
      body: formData
    });
    if (result.ok) {
      setIsCreateModalOpen(false);
      setForm({ title: '', content: '', scheduledFor: '', media: null });
      loadBlasts();
    }
  }

  async function handleRelease(ublastId: string) {
    const result = await apiRequest({
      path: `/api/admin/ublasts/${ublastId}/release`,
      method: 'POST'
    });
    if (result.ok) loadBlasts();
  }

  const columns: Column<any>[] = [{
    key: 'title',
    header: 'Blast Title',
    render: blast => <div className="flex items-center gap-3">
          {blast.mediaUrl && <img src={blast.mediaUrl} alt="" className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-medium text-text-primary">{blast.title}</p>
            <p className="text-xs text-text-secondary">{blast.mediaType || 'Text'}</p>
          </div>
        </div>
  }, {
    key: 'content',
    header: 'Content',
    render: blast => <p className="text-sm text-text-secondary truncate max-w-xs">
          {blast.content || 'No content'}
        </p>
  }, {
    key: 'platforms',
    header: 'Platforms',
    render: blast => <div className="flex gap-1">
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-text-secondary">
            All
          </span>
        </div>
  }, {
    key: 'scheduledFor',
    header: 'Scheduled For',
    render: blast => <div>
          <p className="text-sm font-medium text-text-primary">
            {blast.scheduledFor ? new Date(blast.scheduledFor).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-xs text-text-secondary">
            {blast.scheduledFor ? new Date(blast.scheduledFor).toLocaleTimeString() : '--'}
          </p>
        </div>
  }, {
    key: 'status',
    header: 'Status',
    render: blast => <StatusBadge status={blast.status} />
  }];
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            UNAP Blast Scheduling
          </h1>
          <p className="text-text-secondary mt-1">
            Schedule and manage future UNAP Social Media Blasts.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
          Schedule New Blast
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary-gradient/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Automatic Delivery System
            </h3>
            <p className="text-sm text-text-secondary">
              Scheduled UNAP Blasts are automatically delivered to every user's
              account at the specified time. Users will have{' '}
              <strong className="text-text-primary">48 hours</strong> to share
              the blast across their platforms. The blast will remain in the{' '}
              <strong className="text-text-primary">
                Top Trending section for 24 hours
              </strong>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Scheduled
            </h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {scheduledBlasts.filter(b => b.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">Sent</h3>
            <Send className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {scheduledBlasts.filter(b => b.status === 'released').length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Next Blast
            </h3>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {scheduledBlasts.length > 0 && scheduledBlasts[0].scheduledFor ? new Date(scheduledBlasts[0].scheduledFor).toLocaleDateString() : 'None scheduled'}
          </p>
        </div>
      </div>

      {/* Scheduled Blasts Table */}
      {loading && <div className="text-text-secondary">Loading scheduled blasts...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {!loading && <DataTable data={scheduledBlasts} columns={columns} actions={blast => <div className="flex gap-2">
            <Button variant="ghost" size="sm" title="Edit">
              <Edit className="w-4 h-4" />
            </Button>
            {blast.status === 'scheduled' && <>
                <Button variant="secondary" size="sm" title="Send Now" onClick={() => handleRelease(blast._id)}>
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" title="Cancel">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>}
          </div>} />}

      {/* Create Blast Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Schedule UNAP Social Media Blast" size="lg">
        <div className="space-y-6">
          <Input label="Blast Title" placeholder="Enter blast title" value={form.title} onChange={event => setForm(prev => ({
          ...prev,
          title: event.target.value
        }))} />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Content
            </label>
            <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]" placeholder="What's the message?" value={form.content} onChange={event => setForm(prev => ({
          ...prev,
          content: event.target.value
        }))}></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Content Type" options={[{
            value: 'Text',
            label: 'Text'
          }, {
            value: 'Image',
            label: 'Image'
          }, {
            value: 'Video',
            label: 'Video'
          }, {
            value: 'Audio',
            label: 'Audio'
          }]} />
            <Input type="file" label="Media Attachment" className="pt-1.5" onChange={event => setForm(prev => ({
          ...prev,
          media: event.target.files?.[0] || null
        }))} />
          </div>

          <Input label="Hashtags" placeholder="#official #update" />

          <div className="grid grid-cols-2 gap-4">
            <Input type="datetime-local" label="Schedule Date & Time" value={form.scheduledFor} onChange={event => setForm(prev => ({
          ...prev,
          scheduledFor: event.target.value
        }))} />
            <Select label="Target Platforms" options={[{
            value: 'all',
            label: 'All Platforms'
          }, {
            value: 'instagram',
            label: 'Instagram Only'
          }, {
            value: 'tiktok',
            label: 'TikTok Only'
          }]} />
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-2">
              Platform Selection
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {['Instagram', 'TikTok', 'YouTube', 'Spotify'].map(platform => <label key={platform} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-600 text-primary focus:ring-primary" />
                  <span className="text-sm text-text-secondary">
                    {platform}
                  </span>
                </label>)}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button icon={Calendar} onClick={handleCreateBlast}>Schedule Blast</Button>
          </div>
        </div>
      </Modal>
    </div>;
}
