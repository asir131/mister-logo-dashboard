import React, { useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { Button } from '../components/ui/Button';
import { Plus, TrendingUp } from 'lucide-react';
import { mockMetrics } from '../utils/mockData';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
export function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock chart data
  const growthData = [{
    name: 'Mon',
    users: 4000
  }, {
    name: 'Tue',
    users: 3000
  }, {
    name: 'Wed',
    users: 2000
  }, {
    name: 'Thu',
    users: 2780
  }, {
    name: 'Fri',
    users: 1890
  }, {
    name: 'Sat',
    users: 2390
  }, {
    name: 'Sun',
    users: 3490
  }];
  const platformData = [{
    name: 'Instagram',
    shares: 4000
  }, {
    name: 'TikTok',
    shares: 3000
  }, {
    name: 'YouTube',
    shares: 2000
  }, {
    name: 'Spotify',
    shares: 2780
  }];
  const trendingHashtags = [{
    tag: '#NewMusicFriday',
    count: '12.5k'
  }, {
    tag: '#DanceChallenge',
    count: '8.2k'
  }, {
    tag: '#BehindTheScenes',
    count: '6.4k'
  }, {
    tag: '#TourLife',
    count: '5.1k'
  }];
  return <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Dashboard Overview
          </h1>
          <p className="text-text-secondary mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Create Official Post
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            User Growth
          </h3>
          <LineChart data={growthData} dataKey="users" xAxisKey="name" height={300} />
        </div>

        {/* Platform Breakdown */}
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Shares by Platform
          </h3>
          <BarChart data={platformData} dataKey="shares" xAxisKey="name" colors={['#E1306C', '#000000', '#FF0000', '#1DB954']} // Brand colors roughly
        height={300} />
        </div>
      </div>

      {/* Trending Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Trending Hashtags
            </h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {trendingHashtags.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <span className="font-medium text-primary">{item.tag}</span>
                <span className="text-sm text-text-secondary">
                  {item.count} posts
                </span>
              </div>)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-gradient rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">24-Hour Rule Status</h3>
            <p className="text-blue-100 mb-6">
              94% of users have shared the latest official post.
            </p>
            <div className="w-full bg-black/20 rounded-full h-4 mb-2">
              <div className="bg-white rounded-full h-4 w-[94%] transition-all duration-1000"></div>
            </div>
            <div className="flex justify-between text-sm text-blue-100">
              <span>0%</span>
              <span>Target: 100%</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create UNAP Social Media Blast" size="lg">
        <div className="space-y-6">
          <Input label="Post Title" placeholder="Enter post title" />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Post Content
            </label>
            <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]" placeholder="What's on your mind?"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Hashtags" placeholder="#official #update" />
            <Input type="file" label="Media Attachment" className="pt-1.5" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Publish Post</Button>
          </div>
        </div>
      </Modal>
    </div>;
}