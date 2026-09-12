import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Channel, TapframePage, Lead, UserProfile } from '../types';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  channels: Channel[];
  activeChannel: Channel | null;
  pages: TapframePage[];
  leads: Lead[];
  isLoading: boolean;
  canCreatePage: boolean;
  upgradeToPro: () => void;
  setActiveChannel: (channel: Channel) => void;
  createChannel: (channelData: Omit<Channel, 'id' | 'user_id' | 'created_at'>) => Promise<Channel>;
  updateChannel: (channelId: string, updates: Partial<Channel>) => Promise<void>;
  createPage: (pageData: Partial<TapframePage>) => Promise<TapframePage>;
  updatePage: (pageId: string, updates: Partial<TapframePage>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  addLead: (leadData: Omit<Lead, 'id' | 'created_at'>) => Promise<void>;
  recordScan: (pageId: string) => Promise<void>;
  recordClick: (pageId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('clearpath_channels_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    return localStorage.getItem('clearpath_active_channel_id_v2') || '';
  });
  const [pages, setPages] = useState<TapframePage[]>(() => {
    const saved = localStorage.getItem('clearpath_pages_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('clearpath_leads_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>(() => {
    return (localStorage.getItem('clearpath_user_plan') as 'free' | 'pro') || 'free';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('clearpath_channels_v2', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('clearpath_pages_v2', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('clearpath_leads_v2', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('clearpath_user_plan', userPlan);
  }, [userPlan]);

  useEffect(() => {
    if (activeChannelId) {
      localStorage.setItem('clearpath_active_channel_id_v2', activeChannelId);
    }
  }, [activeChannelId]);

  // Handle Supabase Auth & Remote Sync
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await syncWithSupabase(session.user.id);
          }
        }
      } catch (err) {
        console.warn('Supabase auth getSession notice:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await syncWithSupabase(session.user.id);
        }
      }
    });

    // Setup Postgres Realtime Channels for live synchronization
    const realtimeChannel = supabase
      .channel('clearpath-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workflows' },
        (payload: any) => {
          if (!mounted) return;
          const newWorkflow = payload.new;
          if (newWorkflow && newWorkflow.data) {
            const data = newWorkflow.data as { channels?: Channel[]; pages?: TapframePage[]; leads?: Lead[]; plan?: 'free' | 'pro' };
            if (data.channels) setChannels(data.channels);
            if (data.pages) setPages(data.pages);
            if (data.leads) setLeads(data.leads);
            if (data.plan) setUserPlan(data.plan);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload: any) => {
          if (!mounted) return;
          const newLead = payload.new as Lead;
          if (newLead && newLead.email) {
            setLeads(prev => {
              if (prev.some(l => l.id === newLead.id)) return prev;
              return [newLead, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  const syncWithSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data && data.data) {
        const payload = data.data as { channels?: Channel[]; pages?: TapframePage[]; leads?: Lead[]; plan?: 'free' | 'pro' };
        if (payload.channels) setChannels(payload.channels);
        if (payload.pages) setPages(payload.pages);
        if (payload.leads) setLeads(payload.leads);
        if (payload.plan) setUserPlan(payload.plan);
      }
    } catch (err) {
      console.warn('Supabase sync skipped, using local persistence', err);
    }
  };

  const persistToRemote = async (newChannels: Channel[], newPages: TapframePage[], newLeads: Lead[], plan: 'free' | 'pro' = userPlan) => {
    try {
      // 1. If signed in, update workflow
      if (user) {
        await supabase
          .from('workflows')
          .upsert(
            {
              user_id: user.id,
              title: 'ClearpathQR User Workflow',
              current_step: 4,
              data: { channels: newChannels, pages: newPages, leads: newLeads, plan },
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      }

      // 2. Also sync every page to public.pages so external mobile scans can resolve instantly without auth!
      for (const p of newPages) {
        const chan = newChannels.find(c => c.id === p.channel_id) || newChannels[0];
        try {
          await supabase
            .from('pages')
            .upsert({
              id: p.id,
              slug: p.slug,
              user_id: user?.id || null,
              channel_id: p.channel_id,
              title: p.title,
              campaign_name: p.campaign_name,
              badge_text: p.badge_text,
              headline: p.headline,
              subheadline: p.subheadline,
              product_links: p.product_links,
              lead_capture_enabled: p.lead_capture_enabled,
              lead_capture_fields: p.lead_capture_fields,
              lead_magnet_title: p.lead_magnet_title,
              lead_capture_button_text: p.lead_capture_button_text,
              channel_data: chan || null,
              total_scans: p.total_scans || 0,
              total_leads: p.total_leads || 0,
              total_clicks: p.total_clicks || 0,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        } catch (pageErr) {
          // Silent fallback if table not yet run
        }
      }
    } catch (err) {
      console.warn('Auto-save to Supabase notice:', err);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0] || null;

  const setActiveChannel = (channel: Channel) => {
    setActiveChannelId(channel.id);
  };

  const upgradeToPro = () => {
    setUserPlan('pro');
    persistToRemote(channels, pages, leads, 'pro');
  };

  // Requirement: Free tier limit strictly to 1 active Tapframe
  const canCreatePage = userPlan === 'pro' || pages.length < 1;

  const createChannel = async (channelData: Omit<Channel, 'id' | 'user_id' | 'created_at'>): Promise<Channel> => {
    const newChan: Channel = {
      ...channelData,
      id: 'ch-' + Math.random().toString(36).substring(2, 9),
      user_id: user?.id || 'demo-user',
      created_at: new Date().toISOString(),
    };
    const updated = [...channels, newChan];
    setChannels(updated);
    setActiveChannelId(newChan.id);
    await persistToRemote(updated, pages, leads);
    return newChan;
  };

  const updateChannel = async (channelId: string, updates: Partial<Channel>) => {
    const updated = channels.map(c => c.id === channelId ? { ...c, ...updates } : c);
    setChannels(updated);
    await persistToRemote(updated, pages, leads);
  };

  const createPage = async (pageData: Partial<TapframePage>): Promise<TapframePage> => {
    // Check limit
    if (!canCreatePage) {
      throw new Error('FREE_TIER_LIMIT_REACHED');
    }

    const channel = activeChannel || channels[0];
    const newPage: TapframePage = {
      id: 'page-' + Math.random().toString(36).substring(2, 9),
      channel_id: channel?.id || 'default-channel',
      user_id: user?.id || 'demo-user',
      title: pageData.title || 'Untitled QR Page',
      slug: pageData.slug || ('p-' + Math.random().toString(36).substring(2, 7)),
      campaign_name: pageData.campaign_name || `${channel?.name || 'Main'} Campaign`,
      destination_type: pageData.destination_type || 'landing_page',
      external_url: pageData.external_url || '',
      status: pageData.status || 'active',
      headline: pageData.headline || 'Welcome to our exclusive community offer!',
      subheadline: pageData.subheadline || 'Drop your email below to get the free downloadable guide and resources.',
      badge_text: pageData.badge_text || '✨ Exclusive Viewer Offer',
      hero_image_url: pageData.hero_image_url || '',
      product_links: pageData.product_links || [],
      lead_capture_fields: pageData.lead_capture_fields || {
        collect_email: true,
        collect_name: false,
        collect_phone: false,
      },
      lead_capture_enabled: pageData.lead_capture_enabled !== undefined ? pageData.lead_capture_enabled : true,
      lead_capture_placeholder: pageData.lead_capture_placeholder || 'Enter your email address...',
      lead_capture_button_text: pageData.lead_capture_button_text || 'Get Instant Access',
      lead_magnet_title: pageData.lead_magnet_title || 'Free Strategy Guide & Template',
      lead_magnet_download_url: pageData.lead_magnet_download_url || '',
      cta_buttons: pageData.cta_buttons || [],
      social_links: pageData.social_links || [],
      custom_theme: pageData.custom_theme || {
        background_color: '#0B0D17',
        accent_color: channel?.primary_color || '#8B5CF6',
        text_color: '#FFFFFF',
        card_style: 'glass',
        qr_style: {
          fg_color: '#000000',
          bg_color: '#FFFFFF',
          frame_style: 'dark_pill',
          callout_text: 'Scan the QR code to access the free resources',
        }
      },
      associated_content: pageData.associated_content || {
        type: 'youtube',
        title: 'Latest Video',
      },
      total_scans: 0,
      unique_visitors: 0,
      total_clicks: 0,
      total_leads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newPage, ...pages];
    setPages(updated);
    await persistToRemote(channels, updated, leads);
    return newPage;
  };

  const updatePage = async (pageId: string, updates: Partial<TapframePage>) => {
    const updated = pages.map(p => p.id === pageId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    setPages(updated);
    await persistToRemote(channels, updated, leads);
  };

  const deletePage = async (pageId: string) => {
    const updated = pages.filter(p => p.id !== pageId);
    setPages(updated);
    await persistToRemote(channels, updated, leads);
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    const updated = [newLead, ...leads];
    setLeads(updated);

    // Increment lead count on the corresponding page
    const updatedPages = pages.map(p => {
      if (p.id === leadData.page_id) {
        return { ...p, total_leads: (p.total_leads || 0) + 1 };
      }
      return p;
    });
    setPages(updatedPages);
    await persistToRemote(channels, updatedPages, updated);
  };

  const recordScan = async (pageId: string) => {
    const updatedPages = pages.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          total_scans: (p.total_scans || 0) + 1,
          unique_visitors: (p.unique_visitors || 0) + 1
        };
      }
      return p;
    });
    setPages(updatedPages);
    await persistToRemote(channels, updatedPages, leads);
  };

  const recordClick = async (pageId: string) => {
    const updatedPages = pages.map(p => {
      if (p.id === pageId) {
        return { ...p, total_clicks: (p.total_clicks || 0) + 1 };
      }
      return p;
    });
    setPages(updatedPages);
    await persistToRemote(channels, updatedPages, leads);
  };

  const refreshData = async () => {
    if (user) {
      await syncWithSupabase(user.id);
    }
  };

  const profile: UserProfile = {
    id: user?.id || 'demo-user-1',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || '',
    avatar_url: activeChannel?.avatar_url || '',
    plan: userPlan,
    channels,
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        channels,
        activeChannel,
        pages,
        leads,
        isLoading,
        canCreatePage,
        upgradeToPro,
        setActiveChannel,
        createChannel,
        updateChannel,
        createPage,
        updatePage,
        deletePage,
        addLead,
        recordScan,
        recordClick,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
