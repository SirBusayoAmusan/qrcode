export interface Channel {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'podcast' | 'other';
  avatar_url: string;
  banner_url?: string;
  subscriber_count?: string;
  description?: string;
  primary_color: string;
  created_at: string;
}

export interface TapframePage {
  id: string;
  channel_id: string;
  user_id: string;
  title: string;
  slug: string;
  campaign_name: string;
  associated_content?: {
    type: 'youtube' | 'podcast' | 'livestream' | 'tiktok' | 'presentation';
    title: string;
    video_url?: string;
    timestamp?: string;
  };
  destination_type: 'landing_page' | 'external_url';
  external_url?: string;
  status: 'active' | 'archived' | 'draft';
  // Landing page builder fields
  headline: string;
  subheadline: string;
  badge_text?: string;
  hero_image_url?: string;
  lead_capture_enabled: boolean;
  lead_capture_placeholder?: string;
  lead_capture_button_text?: string;
  lead_magnet_title?: string;
  lead_magnet_download_url?: string;
  cta_buttons: Array<{
    id: string;
    label: string;
    url: string;
    variant: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  social_links: Array<{
    platform: 'youtube' | 'twitter' | 'instagram' | 'spotify' | 'tiktok' | 'website';
    url: string;
  }>;
  custom_theme: {
    background_color: string;
    accent_color: string;
    text_color: string;
    card_style: 'glass' | 'solid' | 'minimal';
    qr_style?: {
      fg_color: string;
      bg_color: string;
      frame_style: 'standard' | 'gradient_border' | 'card_bottom_label' | 'dark_pill';
      callout_text?: string;
    };
  };
  // Analytics aggregate
  total_scans: number;
  unique_visitors: number;
  total_clicks: number;
  total_leads: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  page_id: string;
  page_title: string;
  campaign_name: string;
  channel_id: string;
  email: string;
  name?: string;
  source: string;
  referrer?: string;
  device: 'mobile' | 'desktop' | 'tablet';
  country: string;
  city?: string;
  created_at: string;
}

export interface ScanEvent {
  id: string;
  page_id: string;
  timestamp: string;
  device: 'iPhone' | 'Android' | 'Desktop' | 'iPad';
  browser: 'Safari' | 'Chrome' | 'Firefox';
  country: string;
  converted: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro';
  channels: Channel[];
}
