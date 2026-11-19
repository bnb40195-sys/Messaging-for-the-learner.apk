export type MessageType = 'text' | 'image' | 'voice' | 'file';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  mediaUrl?: string;
  voiceDuration?: number; // in seconds
  voiceWaveform?: number[]; // simulated waveform bars
  timestamp: string;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, number>;
  isPinned?: boolean;
  selfDestructIn?: number; // seconds, if enabled
}

export interface Contact {
  id: string;
  name: string;
  nameEn: string;
  username: string;
  avatar: string;
  statusText: string;
  statusTextEn: string;
  isOnline: boolean;
  lastSeen?: string;
  unreadCount: number;
  category: 'all' | 'direct' | 'group' | 'ai' | 'favorites';
  isPinned?: boolean;
  isVerified?: boolean;
  typing?: boolean;
  messages: Message[];
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl?: string;
  gradient?: string;
  caption: string;
  timestamp: string;
  viewsCount: number;
  isViewed: boolean;
}

export interface MessengerSite {
  id: string;
  name: string;
  nameAr: string;
  category: 'popular' | 'work' | 'secure' | 'gaming' | 'social';
  url: string;
  iconBg: string;
  badgeColor: string;
  logoSvgKey: 'whatsapp' | 'telegram' | 'discord' | 'messenger' | 'slack' | 'signal' | 'skype' | 'teams' | 'googlechat' | 'wechat' | 'x' | 'element' | 'custom';
  descriptionAr: string;
  descriptionEn: string;
  supportsEmbed: boolean;
  verifiedUrl: string;
  directLaunchGuideAr: string;
  isFavorite?: boolean;
  status: 'online' | 'degraded';
}

export type ActiveTab = 'chats' | 'hub' | 'stories' | 'ai' | 'settings';
