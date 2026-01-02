import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { mockUsers } from '../utils/mockData';
import { Mail, MessageSquare, Users, Send, Download, Filter } from 'lucide-react';
export function CommunicationsPage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const totalUsers = mockUsers.length;
  const emailOptIn = mockUsers.filter(u => u.emailOptIn).length;
  const smsOptIn = mockUsers.filter(u => u.smsOptIn).length;
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
            {totalUsers}
          </h3>
          <p className="text-sm text-text-secondary">Total Users</p>
        </div>

        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              {(emailOptIn / totalUsers * 100).toFixed(0)}% Opt-in
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">
            {emailOptIn}
          </h3>
          <p className="text-sm text-text-secondary">Email Reachable</p>
        </div>

        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              {(smsOptIn / totalUsers * 100).toFixed(0)}% Opt-in
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">
            {smsOptIn}
          </h3>
          <p className="text-sm text-text-secondary">SMS Reachable</p>
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
                Send mass email to all opted-in users ({emailOptIn} recipients)
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
                Send mass SMS to all opted-in users ({smsOptIn} recipients)
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
              {mockUsers.map(user => <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
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
                  <td className="px-6 py-4 text-text-primary">{user.email}</td>
                  <td className="px-6 py-4 text-text-primary">{user.phone}</td>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Blast Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Compose Email Blast" size="lg">
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              This email will be sent to <strong>{emailOptIn} users</strong> who
              have opted in to email communications.
            </p>
          </div>

          <Input label="Subject Line" placeholder="Enter email subject..." />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Email Content
            </label>
            <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px]" placeholder="Compose your email message..."></textarea>
          </div>

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
            <Button icon={Send}>Send Email Blast</Button>
          </div>
        </div>
      </Modal>

      {/* SMS Blast Modal */}
      <Modal isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} title="Compose SMS Blast" size="md">
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400">
              This SMS will be sent to <strong>{smsOptIn} users</strong> who
              have opted in to SMS communications.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Message (160 characters max)
            </label>
            <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]" placeholder="Type your SMS message..." maxLength={160}></textarea>
            <p className="text-xs text-text-muted mt-1">0 / 160 characters</p>
          </div>

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
            <Button icon={Send}>Send SMS Blast</Button>
          </div>
        </div>
      </Modal>
    </div>;
}