import React, { useEffect, useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { BarChart3, Megaphone, Share2, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOverview } from '../store/slices/overviewSlice';
export function OverviewPage() {
  const dispatch = useAppDispatch();
  const {
    stats,
    growthData,
    platformData,
    trendingHashtags,
    loading: statsLoading,
    error: statsError,
  } = useAppSelector((state) => state.overview);
  useEffect(() => {
    dispatch(fetchOverview());
  }, [dispatch]);
  const formatValue = (value: number) => value.toLocaleString();
  const displayValue = (value: number) => {
    if (statsLoading) return 'Loading...';
    if (statsError) return '—';
    return formatValue(value);
  };
  const percentValue = statsLoading ? 0 : Math.max(0, Math.min(100, stats.ublastSharePercent));
  const percentLabel = statsLoading || statsError ? '—' : `${percentValue}%`;
  const shareDetail = statsLoading || statsError
    ? 'Loading...'
    : `${formatValue(stats.ublastSharedCount)} of ${formatValue(stats.ublastShareTarget)} users shared the latest UBlast in 24 hours.`;
  const metrics = [{
    label: 'Total Users',
    value: displayValue(stats.totalUsers),
    icon: Users
  }, {
    label: 'Total UPosts',
    value: displayValue(stats.totalUposts),
    icon: BarChart3
  }, {
    label: 'Total UBlasts',
    value: displayValue(stats.totalUblasts),
    icon: Megaphone
  }, {
    label: 'UBlast Shares',
    value: displayValue(stats.totalUblastShares),
    icon: Share2
  }, {
    label: 'Active Users',
    value: displayValue(stats.totalActiveUsers),
    icon: UserCheck
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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
      </div>
      {statsError && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {statsError}
        </div>}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            User Growth
          </h3>
          <LineChart data={growthData} dataKey="users" xAxisKey="name" height={300} />
        </div>

        {/* Platform Breakdown */}
        <div className="lg:col-span-2 bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Shares by Platform
          </h3>
          <BarChart data={platformData} dataKey="shares" xAxisKey="name" colors={['#E1306C', '#010101', '#FF0000', '#FFFC00', '#1DA1F2', '#1877F2']} // Instagram, TikTok, YouTube, Snapchat, Twitter, Facebook
        height={360} />
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
            {trendingHashtags.length === 0 && <div className="text-sm text-text-secondary">
                {statsLoading ? 'Loading hashtags...' : 'No hashtags found yet.'}
              </div>}
            {trendingHashtags.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <span className="font-medium text-primary">{item.tag}</span>
                <span className="text-sm text-text-secondary">
                  {item.count.toLocaleString()} posts
                </span>
              </div>)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-gradient rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">24-Hour Rule Status</h3>
            <p className="text-blue-100 mb-6">{shareDetail}</p>
            <div className="w-full bg-black/20 rounded-full h-4 mb-2">
              <div className="bg-white rounded-full h-4 transition-all duration-1000" style={{
              width: `${percentValue}%`
            }}></div>
            </div>
            <div className="flex justify-between text-sm text-blue-100">
              <span>0%</span>
              <span>{percentLabel}</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        </div>
      </div>

    </div>;
}
