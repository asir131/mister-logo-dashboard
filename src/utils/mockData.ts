import { User, Post, ChatSession, Metric, Submission, ScheduledBlast, ModerationAction } from '../types';
import { Users, FileText, Share2, Eye, Heart, MessageCircle, Bookmark, TrendingUp, Instagram, Youtube, Music, Video } from 'lucide-react';

// Mock Users
export const mockUsers: User[] = [{
  id: '1',
  name: 'Sarah Jenkins',
  username: '@sarahj_sings',
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  followers: 125000,
  totalPosts: 342,
  status: 'Active',
  linkedPlatforms: ['Instagram', 'TikTok', 'Spotify'],
  lastActivity: '2 mins ago',
  joinedDate: '2023-01-15',
  emailOptIn: true,
  smsOptIn: true
}, {
  id: '2',
  name: 'Marcus Chen',
  username: '@marcus_dance',
  email: 'marcus@example.com',
  phone: '+1 (555) 987-6543',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  followers: 890000,
  totalPosts: 156,
  status: 'Restricted',
  linkedPlatforms: ['TikTok', 'YouTube'],
  lastActivity: '1 day ago',
  joinedDate: '2023-03-22',
  emailOptIn: true,
  smsOptIn: false
}, {
  id: '3',
  name: 'Elara Vance',
  username: '@elara_v',
  email: 'elara@example.com',
  phone: '+1 (555) 456-7890',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  followers: 45000,
  totalPosts: 89,
  status: 'Active',
  linkedPlatforms: ['Instagram', 'YouTube', 'Spotify'],
  lastActivity: '5 hours ago',
  joinedDate: '2023-06-10',
  emailOptIn: true,
  smsOptIn: true
}, {
  id: '4',
  name: 'Davide Rossi',
  username: '@drossi_beats',
  email: 'davide@example.com',
  phone: '+1 (555) 222-3333',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  followers: 12000,
  totalPosts: 45,
  status: 'Suspended',
  linkedPlatforms: ['Spotify', 'YouTube'],
  lastActivity: '2 weeks ago',
  joinedDate: '2023-08-05',
  emailOptIn: false,
  smsOptIn: false
}, {
  id: '5',
  name: 'Jessica Lee',
  username: '@jesslee_official',
  email: 'jessica@example.com',
  phone: '+1 (555) 777-8888',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  followers: 2100000,
  totalPosts: 567,
  status: 'Active',
  linkedPlatforms: ['Instagram', 'TikTok', 'YouTube', 'Spotify'],
  lastActivity: '10 mins ago',
  joinedDate: '2022-11-30',
  emailOptIn: true,
  smsOptIn: true
}];

// Mock Posts
export const mockPosts: Post[] = [{
  id: 'p1',
  userId: '1',
  user: {
    name: 'Sarah Jenkins',
    avatar: mockUsers[0].avatar
  },
  type: 'Video',
  content: 'New music video teaser! 🎵 #NewMusic',
  thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  hashtags: ['#NewMusic', '#Singer', '#Pop'],
  platforms: ['Instagram', 'TikTok', 'YouTube'],
  stats: {
    views: 15000,
    likes: 3200,
    comments: 450,
    saves: 120,
    shares: 85
  },
  status: 'Active',
  createdAt: '2023-10-25T10:30:00Z',
  isUnapBlast: false
}, {
  id: 'p2',
  userId: '2',
  user: {
    name: 'Marcus Chen',
    avatar: mockUsers[1].avatar
  },
  type: 'Video',
  content: 'Dance challenge tutorial 🕺',
  thumbnail: 'https://images.unsplash.com/photo-1535525266638-c89318f17a35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  hashtags: ['#Dance', '#Tutorial', '#Challenge'],
  platforms: ['TikTok', 'Instagram'],
  stats: {
    views: 45000,
    likes: 8900,
    comments: 1200,
    saves: 3400,
    shares: 2100
  },
  status: 'Reported',
  createdAt: '2023-10-24T15:45:00Z',
  isUnapBlast: false
}, {
  id: 'p3',
  userId: 'admin',
  user: {
    name: 'UNAP Official',
    avatar: 'https://ui-avatars.com/api/?name=UNAP&background=3B82F6&color=fff'
  },
  type: 'Text',
  content: 'Community Guidelines Update: Please review the new policies regarding sponsored content.',
  hashtags: ['#Update', '#Community', '#Rules'],
  platforms: ['Instagram', 'TikTok', 'YouTube', 'Spotify'],
  stats: {
    views: 120000,
    likes: 5600,
    comments: 0,
    saves: 450,
    shares: 1200
  },
  status: 'Active',
  createdAt: '2023-10-26T09:00:00Z',
  isUnapBlast: true,
  trendingSection: 'unap-blast',
  trendingPosition: 1
}, {
  id: 'p4',
  userId: '3',
  user: {
    name: 'Elara Vance',
    avatar: mockUsers[2].avatar
  },
  type: 'Image',
  content: 'Behind the scenes at the studio 📸',
  thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  hashtags: ['#Studio', '#BTS', '#Recording'],
  platforms: ['Instagram'],
  stats: {
    views: 8500,
    likes: 1200,
    comments: 89,
    saves: 45,
    shares: 12
  },
  status: 'Active',
  createdAt: '2023-10-23T18:20:00Z',
  isUnapBlast: false,
  trendingSection: 'organic',
  trendingPosition: 5
}, {
  id: 'p5',
  userId: '5',
  user: {
    name: 'Jessica Lee',
    avatar: mockUsers[4].avatar
  },
  type: 'Audio',
  content: 'My new single "Midnight Rain" is out now!',
  thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  hashtags: ['#NewSingle', '#MidnightRain', '#Music'],
  platforms: ['Spotify', 'YouTube'],
  stats: {
    views: 250000,
    likes: 45000,
    comments: 3400,
    saves: 12000,
    shares: 5600
  },
  status: 'Active',
  createdAt: '2023-10-22T00:00:00Z',
  isUnapBlast: false,
  trendingSection: 'manual-pinned',
  trendingPosition: 1
}];

// Mock Submissions
export const mockSubmissions: Submission[] = [{
  id: 's1',
  userId: '1',
  user: {
    name: 'Sarah Jenkins',
    avatar: mockUsers[0].avatar,
    username: '@sarahj_sings'
  },
  blastId: 'p3',
  blastTitle: 'Community Guidelines Update',
  submittedAt: '2023-10-26T10:30:00Z',
  status: 'Approved',
  content: 'I have read and shared the community guidelines update across all my platforms.',
  attachments: ['https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=500'],
  adminNotes: 'Verified - shared on all platforms',
  reviewedBy: 'Admin',
  reviewedAt: '2023-10-26T11:00:00Z'
}, {
  id: 's2',
  userId: '2',
  user: {
    name: 'Marcus Chen',
    avatar: mockUsers[1].avatar,
    username: '@marcus_dance'
  },
  blastId: 'p3',
  blastTitle: 'Community Guidelines Update',
  submittedAt: '2023-10-26T14:20:00Z',
  status: 'Pending',
  content: 'Shared on TikTok and Instagram as required.',
  attachments: []
}, {
  id: 's3',
  userId: '5',
  user: {
    name: 'Jessica Lee',
    avatar: mockUsers[4].avatar,
    username: '@jesslee_official'
  },
  blastId: 'p3',
  blastTitle: 'Community Guidelines Update',
  submittedAt: '2023-10-26T09:45:00Z',
  status: 'Approved',
  content: 'Posted to all 4 platforms with proper hashtags.',
  attachments: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500'],
  adminNotes: 'Excellent compliance',
  reviewedBy: 'Admin',
  reviewedAt: '2023-10-26T10:15:00Z'
}];

// Mock Scheduled Blasts
export const mockScheduledBlasts: ScheduledBlast[] = [{
  id: 'sb1',
  title: 'Holiday Special Announcement',
  content: 'Join us for our special holiday event! Details coming soon. #HolidaySpecial #UNAP',
  type: 'Image',
  platforms: ['Instagram', 'TikTok', 'YouTube', 'Spotify'],
  scheduledFor: '2023-12-15T12:00:00Z',
  createdAt: '2023-10-20T10:00:00Z',
  createdBy: 'Admin',
  status: 'scheduled',
  thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=500',
  hashtags: ['#HolidaySpecial', '#UNAP']
}, {
  id: 'sb2',
  title: 'New Feature Launch',
  content: 'Exciting new features coming to UNAP! Stay tuned for the big reveal.',
  type: 'Video',
  platforms: ['Instagram', 'TikTok', 'YouTube'],
  scheduledFor: '2023-11-01T09:00:00Z',
  createdAt: '2023-10-22T14:30:00Z',
  createdBy: 'Admin',
  status: 'scheduled',
  hashtags: ['#NewFeatures', '#UNAP', '#ComingSoon']
}];

// Mock Moderation Actions
export const mockModerationActions: ModerationAction[] = [{
  id: 'ma1',
  type: 'restrict',
  targetType: 'user',
  targetId: '2',
  targetName: 'Marcus Chen',
  performedBy: 'Admin',
  performedAt: '2023-10-25T16:00:00Z',
  reason: 'Failed to share UNAP Blast within 48 hours',
  notes: 'User notified via email. Restriction period: 3 days'
}, {
  id: 'ma2',
  type: 'remove_post',
  targetType: 'post',
  targetId: 'p2',
  targetName: 'Dance challenge tutorial',
  performedBy: 'Admin',
  performedAt: '2023-10-24T18:00:00Z',
  reason: 'Reported for copyright violation',
  notes: 'User contacted for clarification'
}, {
  id: 'ma3',
  type: 'block',
  targetType: 'user',
  targetId: '4',
  targetName: 'Davide Rossi',
  performedBy: 'Admin',
  performedAt: '2023-10-20T12:00:00Z',
  reason: 'Multiple policy violations',
  notes: 'Permanent block - severe violations'
}];

// Mock Chat Sessions
export const mockChats: ChatSession[] = [{
  id: 'c1',
  userId: '1',
  user: mockUsers[0],
  unreadCount: 2,
  status: 'Open',
  lastMessage: 'I cannot link my Spotify account, getting an error.',
  lastMessageTime: '10:30 AM',
  messages: [{
    id: 'm1',
    senderId: '1',
    text: 'Hi support team!',
    timestamp: '10:28 AM',
    isAdmin: false
  }, {
    id: 'm2',
    senderId: '1',
    text: 'I cannot link my Spotify account, getting an error.',
    timestamp: '10:30 AM',
    isAdmin: false
  }]
}, {
  id: 'c2',
  userId: '2',
  user: mockUsers[1],
  unreadCount: 0,
  status: 'In Progress',
  lastMessage: 'We are looking into this issue for you.',
  lastMessageTime: 'Yesterday',
  messages: [{
    id: 'm3',
    senderId: '2',
    text: 'Why was my post removed?',
    timestamp: 'Yesterday 2:00 PM',
    isAdmin: false
  }, {
    id: 'm4',
    senderId: 'admin',
    text: 'It violated our copyright policy.',
    timestamp: 'Yesterday 2:15 PM',
    isAdmin: true
  }, {
    id: 'm5',
    senderId: '2',
    text: 'But I own the rights!',
    timestamp: 'Yesterday 2:20 PM',
    isAdmin: false
  }, {
    id: 'm6',
    senderId: 'admin',
    text: 'We are looking into this issue for you.',
    timestamp: 'Yesterday 2:30 PM',
    isAdmin: true
  }]
}, {
  id: 'c3',
  userId: '4',
  user: mockUsers[3],
  unreadCount: 0,
  status: 'Resolved',
  lastMessage: 'Thank you for your help!',
  lastMessageTime: 'Oct 20',
  messages: [{
    id: 'm7',
    senderId: '4',
    text: 'How do I change my password?',
    timestamp: 'Oct 20 9:00 AM',
    isAdmin: false
  }, {
    id: 'm8',
    senderId: 'admin',
    text: 'Go to Settings > Account > Change Password.',
    timestamp: 'Oct 20 9:05 AM',
    isAdmin: true
  }, {
    id: 'm9',
    senderId: '4',
    text: 'Thank you for your help!',
    timestamp: 'Oct 20 9:10 AM',
    isAdmin: false
  }]
}];

// Mock Metrics
export const mockMetrics: Metric[] = [{
  label: 'Total Users',
  value: '12,450',
  trend: 12.5,
  trendDirection: 'up',
  icon: Users
}, {
  label: 'Total Posts',
  value: '84,392',
  trend: 8.2,
  trendDirection: 'up',
  icon: FileText
}, {
  label: 'Total Shares',
  value: '1.2M',
  trend: 24.3,
  trendDirection: 'up',
  icon: Share2
}, {
  label: 'Active Users',
  value: '8,920',
  trend: 5.4,
  trendDirection: 'up',
  icon: TrendingUp
}];