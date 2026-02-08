import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { apiRequest } from '../utils/apiClient';
import { Mail, MessageSquare, Users, Send, Download, Filter } from 'lucide-react';
export function CommunicationsPage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [totalPhones, setTotalPhones] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const limit = 20;
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'active' | 'restricted' | 'selected'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [smsFilter, setSmsFilter] = useState<'all' | 'active' | 'restricted' | 'selected'>('all');
  const [selectedSmsUserIds, setSelectedSmsUserIds] = useState<string[]>([]);
  const [smsSending, setSmsSending] = useState(false);
  const [smsStatus, setSmsStatus] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      setLoading(true);
      setError('');
      try {
        const result = await apiRequest({
          path: `/api/admin/users?page=${page}&limit=${limit}&filter=all`,
        });
        if (!result.ok) {
          throw new Error(result.data?.error || 'Failed to load users.');
        }
        if (isMounted) {
          setUsers(Array.isArray(result.data?.users) ? result.data.users : []);
          setTotalPages(Number(result.data?.totalPages || 1));
          setTotalCount(Number(result.data?.totalCount || 0));
          setTotalEmails(Number(result.data?.totalEmails || 0));
          setTotalPhones(Number(result.data?.totalPhones || 0));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load users.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [page]);

  const rows = useMemo(() => {
    return users.map(user => ({
      ...user,
      emailOptIn: Boolean(user.email && String(user.email).trim()),
      smsOptIn: Boolean(user.phone && String(user.phone).trim()),
      statusLabel: user.ublastBlocked ? 'Restricted' : 'Active',
    }));
  }, [users]);
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Communications Center
          </h1>
          <p className="text-text-secondary mt-1">
            Send mass emails and SMS to your user base.
          </p>
        </div>
        <Button icon={Download}>Export Database</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">
            {totalCount}
          </h3>
          <p className="text-sm text-text-secondary">Total Users</p>
        </div>

        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">
            {totalEmails}
          </h3>
          <p className="text-sm text-text-secondary">Total Emails</p>
        </div>

        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">
            {totalPhones}
          </h3>
          <p className="text-sm text-text-secondary">Total Phone Numbers</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Blast */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Email Blast
              </h3>
              <p className="text-sm text-text-secondary">
                Send mass email to all users with email ({totalEmails} recipients)
              </p>
            </div>
          </div>
          <Button className="w-full" icon={Mail} onClick={() => setIsEmailModalOpen(true)}>
            Compose Email Blast
          </Button>
        </div>

        {/* SMS Blast */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                SMS Blast
              </h3>
              <p className="text-sm text-text-secondary">
                Send mass SMS to all users with phone ({totalPhones} recipients)
              </p>
            </div>
          </div>
          <Button className="w-full" icon={MessageSquare} onClick={() => setIsSmsModalOpen(true)}>
            Compose SMS Blast
          </Button>
        </div>
      </div>

      {/* User Database Table */}
      <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary">
            User Contact Database
          </h3>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={Filter}>
              Filter
            </Button>
            <Button variant="secondary" size="sm" icon={Download}>
              Export CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-text-secondary uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email Opt-in</th>
                <th className="px-6 py-4">SMS Opt-in</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {rows.map(user => <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-text-secondary">
                          {user.name?.[0] || 'U'}
                        </div>}
                      <div>
                        <p className="font-medium text-text-primary">
                          {user.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-primary">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-text-primary">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.emailOptIn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {user.emailOptIn ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.smsOptIn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {user.smsOptIn ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.statusLabel === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {user.statusLabel}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between text-sm text-text-secondary">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
        {loading && <div className="px-6 py-4 text-sm text-text-secondary">Loading users...</div>}
        {error && <div className="px-6 py-4 text-sm text-red-400">{error}</div>}
      </div>

      {/* Email Blast Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Compose Email Blast" size="lg">
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              This email will be sent to <strong>{totalEmails} users</strong> who
              have an email address.
            </p>
          </div>

          <Input
            label="Subject Line"
            placeholder="Enter email subject..."
            value={emailSubject}
            onChange={(event) => setEmailSubject(event.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Email Content
            </label>
            <textarea
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px]"
              placeholder="Compose your email message..."
              value={emailContent}
              onChange={(event) => setEmailContent(event.target.value)}
            />
          </div>

          <Select
            label="Audience Filter"
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'active', label: 'Active Users' },
              { value: 'restricted', label: 'Restricted Users' },
              { value: 'selected', label: 'Selected Users' },
            ]}
            value={emailFilter}
            onChange={(event) =>
              setEmailFilter(event.target.value as 'all' | 'active' | 'restricted' | 'selected')
            }
          />

          {emailFilter === 'selected' && (
            <div className="space-y-3">
              <div className="text-sm text-text-secondary">
                Select users from the current page.
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-700 rounded-lg divide-y divide-slate-700">
                {rows.map((user) => (
                  <label key={user.id} className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedUserIds((prev) => [...prev, user.id]);
                        } else {
                          setSelectedUserIds((prev) => prev.filter((id) => id !== user.id));
                        }
                      }}
                    />
                    <span>{user.name || user.email || user.id}</span>
                    <span className="text-xs text-text-secondary">{user.email || '-'}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-text-secondary">
                Selected: {selectedUserIds.length}
              </div>
            </div>
          )}

          <Select label="Sender Name" options={[{
          value: 'unap',
          label: 'UNAP Team'
        }, {
          value: 'admin',
          label: 'Admin'
        }, {
          value: 'support',
          label: 'Support Team'
        }]} />

          <div className="flex items-center gap-2">
            <input type="checkbox" id="preview" className="rounded border-slate-600 text-primary focus:ring-primary" />
            <label htmlFor="preview" className="text-sm text-text-secondary cursor-pointer">
              Send test email to myself first
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={Send}
              disabled={emailSending}
              onClick={async () => {
                setEmailStatus('');
                if (!emailSubject.trim() || !emailContent.trim()) {
                  setEmailStatus('Subject and content are required.');
                  return;
                }
                if (emailFilter === 'selected' && selectedUserIds.length === 0) {
                  setEmailStatus('Select at least one user.');
                  return;
                }
                setEmailSending(true);
                const result = await apiRequest({
                  path: '/api/admin/communications/email',
                  method: 'POST',
                  body: {
                    subject: emailSubject.trim(),
                    content: emailContent.trim(),
                    filter: emailFilter,
                    userIds: emailFilter === 'selected' ? selectedUserIds : [],
                  },
                });
                setEmailSending(false);
                if (!result.ok) {
                  setEmailStatus(result.data?.error || 'Failed to send email blast.');
                  return;
                }
                const sent = result.data?.sent ?? 0;
                const failed = result.data?.failed ?? 0;
                setEmailStatus(`Sent ${sent} emails. Failed ${failed}.`);
              }}
            >
              {emailSending ? 'Sending...' : 'Send Email Blast'}
            </Button>
          </div>
          {emailStatus && (
            <div className="text-sm text-text-secondary">{emailStatus}</div>
          )}
        </div>
      </Modal>

      {/* SMS Blast Modal */}
      <Modal isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} title="Compose SMS Blast" size="md">
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400">
              This SMS will be sent to <strong>{totalPhones} users</strong> who
              have a phone number.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Message (160 characters max)
            </label>
            <textarea
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
              placeholder="Type your SMS message..."
              maxLength={160}
              value={smsContent}
              onChange={(event) => setSmsContent(event.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">{smsContent.length} / 160 characters</p>
          </div>

          <Select
            label="Audience Filter"
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'active', label: 'Active Users' },
              { value: 'restricted', label: 'Restricted Users' },
              { value: 'selected', label: 'Selected Users' },
            ]}
            value={smsFilter}
            onChange={(event) =>
              setSmsFilter(event.target.value as 'all' | 'active' | 'restricted' | 'selected')
            }
          />

          {smsFilter === 'selected' && (
            <div className="space-y-3">
              <div className="text-sm text-text-secondary">
                Select users from the current page.
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-700 rounded-lg divide-y divide-slate-700">
                {rows.map((user) => (
                  <label key={user.id} className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={selectedSmsUserIds.includes(user.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedSmsUserIds((prev) => [...prev, user.id]);
                        } else {
                          setSelectedSmsUserIds((prev) => prev.filter((id) => id !== user.id));
                        }
                      }}
                    />
                    <span>{user.name || user.phone || user.id}</span>
                    <span className="text-xs text-text-secondary">{user.phone || '-'}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-text-secondary">
                Selected: {selectedSmsUserIds.length}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input type="checkbox" id="smsPreview" className="rounded border-slate-600 text-primary focus:ring-primary" />
            <label htmlFor="smsPreview" className="text-sm text-text-secondary cursor-pointer">
              Send test SMS to my number first
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsSmsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={Send}
              disabled={smsSending}
              onClick={async () => {
                setSmsStatus('');
                if (!smsContent.trim()) {
                  setSmsStatus('Message content is required.');
                  return;
                }
                if (smsFilter === 'selected' && selectedSmsUserIds.length === 0) {
                  setSmsStatus('Select at least one user.');
                  return;
                }
                setSmsSending(true);
                const result = await apiRequest({
                  path: '/api/admin/communications/sms',
                  method: 'POST',
                  body: {
                    content: smsContent.trim(),
                    filter: smsFilter,
                    userIds: smsFilter === 'selected' ? selectedSmsUserIds : [],
                  },
                });
                setSmsSending(false);
                if (!result.ok) {
                  setSmsStatus(result.data?.error || 'Failed to send SMS blast.');
                  return;
                }
                const sent = result.data?.sent ?? 0;
                const failed = result.data?.failed ?? 0;
                setSmsStatus(`Sent ${sent} SMS. Failed ${failed}.`);
              }}
            >
              {smsSending ? 'Sending...' : 'Send SMS Blast'}
            </Button>
          </div>
          {smsStatus && (
            <div className="text-sm text-text-secondary">{smsStatus}</div>
          )}
        </div>
      </Modal>
    </div>;
}
