export type UserStatus = 'Active' | 'Restricted' | 'Suspended' | 'Blocked';
export type PostType = 'Text' | 'Image' | 'Video' | 'Audio';
export type PostStatus = 'Active' | 'Reported' | 'Removed';
export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'Spotify';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';
export type TrendingSection = 'unap-blast' | 'manual-pinned' | 'organic';
export type ModerationActionType = 'restrict' | 'unrestrict' | 'block' | 'unblock' | 'delete' | 'remove_post' | 'restore_post' | 'delete_post';
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  followers: number;
  totalPosts: number;
  status: UserStatus;
  linkedPlatforms: Platform[];
  lastActivity: string;
  joinedDate: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
}
export interface Post {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  type: PostType;
  content: string;
  thumbnail?: string;
  hashtags: string[];
  platforms: Platform[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
  status: PostStatus;
  createdAt: string;
  isUnapBlast: boolean;
  trendingSection?: TrendingSection;
  trendingPosition?: number;
}
export interface Submission {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  blastId: string;
  blastTitle: string;
  submittedAt: string;
  status: SubmissionStatus;
  content: string;
  attachments?: string[];
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}
export interface ScheduledBlast {
  id: string;
  title: string;
  content: string;
  type: PostType;
  platforms: Platform[];
  scheduledFor: string;
  createdAt: string;
  createdBy: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  thumbnail?: string;
  hashtags: string[];
}
export interface ModerationAction {
  id: string;
  type: ModerationActionType;
  targetType: 'user' | 'post';
  targetId: string;
  targetName?: string;
  targetEmail?: string;
  performedBy: string;
  performedAt: string;
  reason?: string;
  notes?: string;
}
export interface CommunicationStats {
  totalUsers: number;
  emailOptIn: number;
  smsOptIn: number;
  lastEmailSent?: string;
  lastSmsSent?: string;
}
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}
export interface ChatSession {
  id: string;
  userId: string;
  user: User;
  messages: Message[];
  unreadCount: number;
  status: IssueStatus;
  lastMessage: string;
  lastMessageTime: string;
}
export interface Metric {
  label: string;
  value: string | number;
  trend: number; // percentage
  trendDirection: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}
