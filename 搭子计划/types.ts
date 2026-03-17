export enum ActivityStatus {
  RECRUITING = 'RECRUITING',
  FULL = 'FULL',
  ENDED = 'ENDED'
}

export enum ActivityCategory {
  SPORTS = 'Sports',
  OUTDOORS = 'Outdoors',
  DINING = 'Dining',
  ENTERTAINMENT = 'Entertainment',
  CULTURE = 'Culture',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Partner {
  id: string;
  name: string;
  avatarUrl: string;
  tags: string[];
  intro: string;
  distance: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  imageUrl: string;
  location: string;
  district: string; // e.g., Chaoyang, Haidian
  date: string;
  price: number; // 0 for free
  organizer: User;
  status: ActivityStatus;
  currentParticipants: number;
  maxParticipants: number;
  tags: string[];
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name or emoji for simplicity in this demo
  color: string;
  type: ActivityCategory;
}