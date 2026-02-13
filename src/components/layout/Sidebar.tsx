import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, Settings, LogOut, TrendingUp, ClipboardCheck, Calendar, Shield, Mail, User } from 'lucide-react';
import { clearAdminToken } from '../../utils/adminSession';
import logo from '../../assets/misterLogo.png';
export function Sidebar() {
  const navigate = useNavigate();
  const navItems = [{
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/'
  }, {
    icon: FileText,
    label: 'Post Content',
    path: '/posts'
  }, {
    icon: TrendingUp,
    label: 'Trending Control',
    path: '/trending'
  }, {
    icon: ClipboardCheck,
    label: 'Submissions',
    path: '/submissions'
  }, {
    icon: Calendar,
    label: 'Blast Scheduling',
    path: '/scheduling'
  }, {
    icon: Shield,
    label: 'Moderation',
    path: '/moderation'
  }, {
    icon: Users,
    label: 'Users',
    path: '/users'
  }, {
    icon: Mail,
    label: 'Communications',
    path: '/communications'
  }, {
    icon: MessageSquare,
    label: 'Support Chat',
    path: '/support'
  }, {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  }];
  return <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-slate-700 flex flex-col z-40 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900/40 flex items-center justify-center shadow-lg shadow-black/20 border border-slate-700 overflow-hidden">
            <img src={logo} alt="Mister Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            UNAP
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
        isActive
      }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-slate-800 hover:text-text-primary'}
            `}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>)}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center">
            <User className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => {
            clearAdminToken();
            localStorage.removeItem('unap-admin-key');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-error-text hover:bg-error-bg rounded-lg transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>;
}
