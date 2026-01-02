import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bell, Shield, Lock, Globe, Save } from 'lucide-react';
export function SettingsPage() {
  return <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <Button icon={Save}>Save Changes</Button>
      </div>

      {/* Admin Profile */}
      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Profile
        </h2>
        <div className="flex items-start gap-6">
          <div className="relative group cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff" alt="Admin" className="w-24 h-24 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white">Change</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <Input label="Full Name" defaultValue="Alex Morgan" />
            <Input label="Email Address" defaultValue="admin@unap.app" />
            <Input label="Role" defaultValue="Super Admin" disabled />
            <Button variant="secondary" className="mt-6">
              Change Password
            </Button>
          </div>
        </div>
      </section>

      {/* App Rules */}
      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          App Rules & Restrictions
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-medium text-text-primary">
                24-Hour Share Rule
              </h3>
              <p className="text-sm text-text-secondary">
                Require users to share official posts within 24 hours.
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-primary">
              <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></span>
            </div>
          </div>{' '}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Share Window (Hours)" type="number" defaultValue="48" helper="Time users have to share UNAP Blast" />
            <Input label="Top Trending Duration (Hours)" type="number" defaultValue="24" helper="How long blast stays in top trending" />
            <Input label="Restriction Duration (Days)" type="number" defaultValue="3" helper="Account restriction period for non-compliance" />
            <Input label="Warning Grace Period (Hours)" type="number" defaultValue="4" helper="Grace period before restriction" />
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Platform API Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{
          name: 'Instagram Graph API',
          status: 'Connected',
          color: 'bg-green-500'
        }, {
          name: 'TikTok for Developers',
          status: 'Connected',
          color: 'bg-green-500'
        }, {
          name: 'YouTube Data API',
          status: 'Issues Detected',
          color: 'bg-yellow-500'
        }, {
          name: 'Spotify Web API',
          status: 'Connected',
          color: 'bg-green-500'
        }].map(api => <div key={api.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="font-medium text-text-primary">{api.name}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${api.color}`}></span>
                <span className="text-sm text-text-secondary">
                  {api.status}
                </span>
              </div>
            </div>)}
        </div>
      </section>
    </div>;
}