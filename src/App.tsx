import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { OverviewPage } from './pages/OverviewPage';
import { PostContentPage } from './pages/PostContentPage';
import { TrendingControlPage } from './pages/TrendingControlPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { BlastSchedulingPage } from './pages/BlastSchedulingPage';
import { ModerationPage } from './pages/ModerationPage';
import { UsersPage } from './pages/UsersPage';
import { CommunicationsPage } from './pages/CommunicationsPage';
import { SupportChatPage } from './pages/SupportChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { hasAdminSession } from './utils/adminSession';

function RequireAdmin({ children }: { children: JSX.Element }) {
  if (!hasAdminSession()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
function App() {
  return <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<RequireAdmin>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<OverviewPage />} />
                  <Route path="/posts" element={<PostContentPage />} />
                  <Route path="/trending" element={<TrendingControlPage />} />
                  <Route path="/submissions" element={<SubmissionsPage />} />
                  <Route path="/scheduling" element={<BlastSchedulingPage />} />
                  <Route path="/moderation" element={<ModerationPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/communications" element={<CommunicationsPage />} />
                  <Route path="/support" element={<SupportChatPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AdminLayout>
            </RequireAdmin>} />
      </Routes>
    </Router>;
}
export { App };
