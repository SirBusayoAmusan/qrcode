import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Channel, TapframePage, Lead, UserProfile, DataDeletionRequest } from '../types';
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
  userPlan: 'free' | 'pro';
  trialActive: boolean;
  trialEndDate: string | null;
  upgradeToPro: (billingCycle?: 'monthly' | 'annual') => void;
  startFreeTrial: (billingCycle?: 'monthly' | 'annual') => Promise<void>;
  updateProfilePlan: (plan: 'free' | 'pro', billingCycle?: 'monthly' | 'annual') => Promise<void>;
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
  submitDataDeletionRequest: (email: string, reason?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [pages, setPages] = useState<TapframePage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [trialActive, setTrialActive] = useState<boolean>(false);
  const [trialStartDate, setTrialStartDate] = useState<string | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Default guest channel so first-time creators can create immediately
  const defaultGuestChannel: Channel = {
    id: 'guest-ch-1',
    user_id: 'guest',
    name: 'My Channel',
    handle: '@creator',
    platform: 'youtube',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    primary_color: '#8B5CF6',
    created_at: new Date().toISOString(),
  };

  // Local storage caching helpers scoped to user id
  const loadFromStorage = useCallback((uid: string) => {
    try {
      const savedChannels = localStorage.getItem(`clearpath_channels_${uid}`);
      const savedPages = localStorage.getItem(`clearpath_pages_${uid}`);
      const savedLeads = localStorage.getItem(`clearpath_leads_${uid}`);
      const savedPlan = localStorage.getItem(`clearpath_plan_${uid}`);
      const savedCycle = localStorage.getItem(`clearpath_cycle_${uid}`);
      const savedTrial = localStorage.getItem(`clearpath_trial_${uid}`);
      const savedActiveChannel = localStorage.getItem(`clearpath_active_channel_${uid}`);

      if (savedChannels) {
        const parsed = JSON.parse(savedChannels);
        if (Array.isArray(parsed) && parsed.length > 0) setChannels(parsed);
      } else {
        setChannels([defaultGuestChannel]);
      }

      if (savedPages) {
        const parsed = JSON.parse(savedPages);
        if (Array.isArray(parsed)) setPages(parsed);
      }

      if (savedLeads) {
        const parsed = JSON.parse(savedLeads);
        if (Array.isArray(parsed)) setLeads(parsed);
      }

      if (savedPlan === 'pro' || savedPlan === 'free') setUserPlan(savedPlan);
      if (savedCycle === 'monthly' || savedCycle === 'annual') setBillingCycle(savedCycle);
      
      if (savedTrial) {
        const parsedTrial = JSON.parse(savedTrial);
        setTrialActive(parsedTrial.active ?? false);
        setTrialStartDate(parsedTrial.startDate ?? null);
        setTrialEndDate(parsedTrial.endDate ?? null);
      }

      if (savedActiveChannel) setActiveChannelId(savedActiveChannel);
    } catch (e) {
      console.warn('Error reading scoped localStorage:', e);
    }
  }, []);

  const saveToStorage = useCallback((
    uid: string, 
    newChannels: Channel[], 
    newPages: TapframePage[], 
    newLeads: Lead[], 
    plan: 'free' | 'pro',
    cycle: 'monthly' | 'annual' = billingCycle,
    trial?: { active: boolean; startDate: string | null; endDate: string | null }
  ) => {
    try {
      localStorage.setItem(`clearpath_channels_${uid}`, JSON.stringify(newChannels));
      localStorage.setItem(`clearpath_pages_${uid}`, JSON.stringify(newPages));
      localStorage.setItem(`clearpath_leads_${uid}`, JSON.stringify(newLeads));
      localStorage.setItem(`clearpath_plan_${uid}`, plan);
      localStorage.setItem(`clearpath_cycle_${uid}`, cycle);
      if (trial) {
        localStorage.setItem(`clearpath_trial_${uid}`, JSON.stringify(trial));
      }
    } catch (e) {
      console.warn('Error saving to scoped localStorage:', e);
    }
  }, [billingCycle]);

  const clearAllUserData = () => {
    setChannels([defaultGuestChannel]);
    setPages([]);
    setLeads([]);
    setUserPlan('free');
    setTrialActive(false);
    setTrialStartDate(null);
    setTrialEndDate(null);
    setActiveChannelId('');
  };

  // Full 360 sync across workflows, public.pages, and public.leads
  const syncWithSupabase = async (userId: string) => {
    try {
      // 1. Check local storage first so UI is immediately warm
      loadFromStorage(userId);

      // 2. Fetch workflows table
      const { data: wfData } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // 3. Fetch public.pages table
      const { data: pagesRows } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', userId);

      // 4. Fetch public.leads table
      const { data: leadsRows } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      let mergedChannels: Channel[] = [];
      let mergedPages: TapframePage[] = [];
      let mergedLeads: Lead[] = [];
      let plan: 'free' | 'pro' = 'free';
      let cycle: 'monthly' | 'annual' = 'annual';
      let trial = { active: false, startDate: null as string | null, endDate: null as string | null };

      if (wfData && wfData.data) {
        const payload = wfData.data as any;
        if (payload.channels && payload.channels.length > 0) mergedChannels = payload.channels;
        if (payload.pages && payload.pages.length > 0) mergedPages = payload.pages;
        if (payload.leads && payload.leads.length > 0) mergedLeads = payload.leads;
        if (payload.plan) plan = payload.plan;
        if (payload.billing_cycle) cycle = payload.billing_cycle;
        if (payload.trial) trial = payload.trial;
      }

      // Merge remote pages
      if (pagesRows && pagesRows.length > 0) {
        const remotePagesMap = new Map<string, any>();
        pagesRows.forEach(r => remotePagesMap.set(r.id, r));

        if (mergedPages.length === 0) {
          mergedPages = pagesRows.map(r => ({
            id: r.id,
            slug: r.slug,
            user_id: r.user_id || userId,
            channel_id: r.channel_id || 'ch-1',
            title: r.title || 'Offer',
            campaign_name: r.campaign_name || 'General',
            badge_text: r.badge_text || '',
            headline: r.headline || r.title,
            subheadline: r.subheadline || '',
            product_links: r.product_links || [],
            lead_capture_enabled: r.lead_capture_enabled !== false,
            lead_capture_fields: r.lead_capture_fields || { collect_email: true, collect_name: false, collect_phone: false },
            lead_magnet_title: r.lead_magnet_title || 'Free Strategy Guide & Template',
            lead_capture_button_text: r.lead_capture_button_text || 'Get Access',
            total_scans: r.total_scans || 0,
            unique_visitors: r.total_scans || 0,
            total_leads: r.total_leads || 0,
            total_clicks: r.total_clicks || 0,
            destination_type: 'landing_page',
            status: 'active',
            created_at: r.created_at || new Date().toISOString(),
            updated_at: r.updated_at || new Date().toISOString(),
          }));
        } else {
          mergedPages = mergedPages.map(p => {
            const remote = remotePagesMap.get(p.id);
            if (remote) {
              return {
                ...p,
                total_scans: Math.max(p.total_scans || 0, remote.total_scans || 0),
                total_leads: Math.max(p.total_leads || 0, remote.total_leads || 0),
                total_clicks: Math.max(p.total_clicks || 0, remote.total_clicks || 0),
              };
            }
            return p;
          });
        }

        if (mergedChannels.length === 0) {
          for (const r of pagesRows) {
            if (r.channel_data && r.channel_data.name) {
              mergedChannels.push(r.channel_data);
              break;
            }
          }
        }
      }

      // Merge remote leads
      if (leadsRows && leadsRows.length > 0) {
        const userPageIds = new Set(mergedPages.map(p => p.id));
        const userChannelIds = new Set(mergedChannels.map(c => c.id));

        const relevantLeads: Lead[] = leadsRows
          .filter(l => userPageIds.has(l.page_id) || userChannelIds.has(l.channel_id) || userPageIds.size === 0)
          .map(l => ({
            id: l.id,
            page_id: l.page_id,
            page_title: l.page_title,
            campaign_name: l.campaign_name || 'General',
            channel_id: l.channel_id,
            email: l.email,
            name: l.name || undefined,
            phone: l.phone || undefined,
            source: l.source || 'Mobile QR Scan',
            referrer: l.referrer || 'TV Screen',
            device: (l.device || 'mobile') as any,
            country: l.country || 'Global Viewer',
            city: l.city || undefined,
            created_at: l.created_at,
          }));

        const leadMap = new Map<string, Lead>();
        [...relevantLeads, ...mergedLeads].forEach(l => {
          if (!leadMap.has(l.id)) leadMap.set(l.id, l);
        });
        mergedLeads = Array.from(leadMap.values());
      }

      if (mergedChannels.length > 0) {
        setChannels(mergedChannels);
        if (!activeChannelId) setActiveChannelId(mergedChannels[0].id);
      } else {
        setChannels([defaultGuestChannel]);
      }

      setPages(mergedPages);
      setLeads(mergedLeads);
      setUserPlan(plan);
      setBillingCycle(cycle);
      setTrialActive(trial.active);
      setTrialStartDate(trial.startDate);
      setTrialEndDate(trial.endDate);

      saveToStorage(userId, mergedChannels, mergedPages, mergedLeads, plan, cycle, trial);
    } catch (err) {
      console.warn('Supabase sync notice:', err);
      loadFromStorage(userId);
    }
  };

  // Initial load
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await syncWithSupabase(currentUser.id);
          } else {
            loadFromStorage('guest');
          }
        }
      } catch (err) {
        console.warn('Supabase auth getSession notice:', err);
        loadFromStorage('guest');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_OUT' || !currentUser) {
        loadFromStorage('guest');
      } else if (currentUser) {
        await syncWithSupabase(currentUser.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const persistToRemote = async (
    newChannels: Channel[], 
    newPages: TapframePage[], 
    newLeads: Lead[], 
    plan: 'free' | 'pro' = userPlan,
    cycle: 'monthly' | 'annual' = billingCycle,
    trialState = { active: trialActive, startDate: trialStartDate, endDate: trialEndDate }
  ) => {
    const currentUid = user?.id || 'guest';
    saveToStorage(currentUid, newChannels, newPages, newLeads, plan, cycle, trialState);

    try {
      if (user) {
        await supabase
          .from('workflows')
          .upsert(
            {
              user_id: user.id,
              title: 'ClearpathQR User Workflow',
              current_step: 4,
              data: { 
                channels: newChannels, 
                pages: newPages, 
                leads: newLeads, 
                plan, 
                billing_cycle: cycle,
                trial: trialState 
              },
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      }

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
        } catch (pageErr) {}
      }
    } catch (err) {
      console.warn('Auto-save to Supabase notice:', err);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0] || defaultGuestChannel;

  const setActiveChannel = (channel: Channel) => {
    setActiveChannelId(channel.id);
    if (user?.id) {
      localStorage.setItem(`clearpath_active_channel_${user.id}`, channel.id);
    }
  };

  const upgradeToPro = (cycle: 'monthly' | 'annual' = 'annual') => {
    setUserPlan('pro');
    setBillingCycle(cycle);
    persistToRemote(channels, pages, leads, 'pro', cycle);
  };

  const startFreeTrial = async (cycle: 'monthly' | 'annual' = 'annual') => {
    const now = new Date();
    const end = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const startIso = now.toISOString();
    const endIso = end.toISOString();

    setUserPlan('pro');
    setBillingCycle(cycle);
    setTrialActive(true);
    setTrialStartDate(startIso);
    setTrialEndDate(endIso);

    const trialObj = { active: true, startDate: startIso, endDate: endIso };
    await persistToRemote(channels, pages, leads, 'pro', cycle, trialObj);
  };

  const updateProfilePlan = async (plan: 'free' | 'pro', cycle: 'monthly' | 'annual' = billingCycle) => {
    setUserPlan(plan);
    setBillingCycle(cycle);
    if (plan === 'free') {
      setTrialActive(false);
      await persistToRemote(channels, pages, leads, 'free', cycle, { active: false, startDate: null, endDate: null });
    } else {
      await persistToRemote(channels, pages, leads, 'pro', cycle);
    }
  };

  const activeChannelPages = pages.filter(p => {
    if (!activeChannel) return true;
    return p.channel_id === activeChannel.id;
  });

  const canCreatePage = userPlan === 'pro' || activeChannelPages.length < 1;

  const createChannel = async (channelData: Omit<Channel, 'id' | 'user_id' | 'created_at'>): Promise<Channel> => {
    const newChan: Channel = {
      ...channelData,
      id: 'ch-' + Math.random().toString(36).substring(2, 9),
      user_id: user?.id || 'guest',
      created_at: new Date().toISOString(),
    };
    const updated = [...channels.filter(c => c.id !== 'guest-ch-1'), newChan];
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
    const channel = activeChannel || channels[0] || defaultGuestChannel;
    const newPage: TapframePage = {
      id: 'page-' + Math.random().toString(36).substring(2, 9),
      channel_id: channel.id,
      user_id: user?.id || 'guest',
      title: pageData.title || 'My Video Resource Page',
      slug: pageData.slug || ('p-' + Math.random().toString(36).substring(2, 7)),
      campaign_name: pageData.campaign_name || `${channel.name} Campaign`,
      destination_type: pageData.destination_type || 'landing_page',
      external_url: pageData.external_url || '',
      status: pageData.status || 'active',
      headline: pageData.headline || 'Get My Free Resource Kit',
      subheadline: pageData.subheadline || 'Drop your email below to unlock instant access to all video tools.',
      badge_text: pageData.badge_text || '',
      product_links: pageData.product_links || [],
      lead_capture_fields: pageData.lead_capture_fields || {
        collect_email: true,
        collect_name: false,
        collect_phone: false,
      },
      lead_capture_enabled: pageData.lead_capture_enabled !== undefined ? pageData.lead_capture_enabled : true,
      lead_capture_button_text: pageData.lead_capture_button_text || 'Get Access',
      lead_magnet_title: pageData.lead_magnet_title || 'Free Strategy Guide & Template',
      lead_magnet_download_url: pageData.lead_magnet_download_url || '',
      cta_buttons: pageData.cta_buttons || [],
      custom_theme: pageData.custom_theme || {
        background_color: '#0B0D17',
        accent_color: channel.primary_color || '#8B5CF6',
        text_color: '#FFFFFF',
        card_style: 'glass',
        qr_style: {
          fg_color: '#000000',
          bg_color: '#FFFFFF',
          frame_style: 'dark_pill',
          callout_text: 'Scan the QR code to access the free resources',
        }
      },
      total_scans: 0,
      unique_visitors: 0,
      total_clicks: 0,
      total_leads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newPage, ...pages.filter(p => p.id !== newPage.id)];
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

    try {
      await supabase.from('pages').delete().eq('id', pageId);
    } catch (e) {}
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    const updated = [newLead, ...leads];
    setLeads(updated);

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

  const submitDataDeletionRequest = async (email: string, reason?: string) => {
    try {
      const deletionReqs = JSON.parse(localStorage.getItem('clearpath_deletion_requests') || '[]');
      deletionReqs.push({
        id: 'del-' + Date.now(),
        email: email.trim(),
        reason: reason?.trim() || 'User requested GDPR/CCPA data erasure',
        status: 'submitted',
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('clearpath_deletion_requests', JSON.stringify(deletionReqs));
    } catch (e) {
      console.warn('Data deletion store notice:', e);
    }
  };

  const profile: UserProfile = {
    id: user?.id || 'guest-user',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || '',
    avatar_url: activeChannel?.avatar_url || '',
    plan: userPlan,
    billing_cycle: billingCycle,
    trial_active: trialActive,
    trial_start_date: trialStartDate || undefined,
    trial_end_date: trialEndDate || undefined,
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
        userPlan,
        trialActive,
        trialEndDate,
        upgradeToPro,
        startFreeTrial,
        updateProfilePlan,
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
        submitDataDeletionRequest,
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
