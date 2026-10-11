import { supabase, isSupabaseConfigured } from '../lib/supabase';

/* ── Sticky Notes Service ─────────────────────────────────────────────── */

export interface StickyNoteRecord {
  id?: string;
  message: string;
  author_name?: string;
  badge?: string;
  color_class?: string;
  top?: string;
  left?: string;
  rotate?: number;
  created_at?: string;
}

export const fetchStickyNotesFromDB = async (): Promise<{ data: StickyNoteRecord[]; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('sticky_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[Supabase] Error fetching sticky notes:', error.message);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    console.warn('[Supabase] Fetch exception:', err);
    return { data: [], error: err.message || 'Network error' };
  }
};

export const createStickyNoteInDB = async (
  note: Omit<StickyNoteRecord, 'id' | 'created_at'>
): Promise<{ data: StickyNoteRecord | null; error: string | null }> => {
  // Input Validation
  const trimmedMsg = note.message?.trim();
  if (!trimmedMsg) {
    return { data: null, error: 'Note message cannot be empty.' };
  }
  if (trimmedMsg.length > 280) {
    return { data: null, error: 'Note message exceeds 280 character limit.' };
  }

  if (!isSupabaseConfigured) {
    // Return formatted item for offline/local state fallback
    const localNote: StickyNoteRecord = {
      id: `local-${Date.now()}`,
      message: trimmedMsg,
      author_name: note.author_name || 'Anonymous',
      badge: note.badge || note.author_name || 'Anonymous',
      color_class: note.color_class || 'note-card-yellow',
      top: note.top || '100px',
      left: note.left || '100px',
      rotate: note.rotate || 0,
      created_at: new Date().toISOString(),
    };
    return { data: localNote, error: null };
  }

  try {
    const fallbackName = (note.author_name || 'Anonymous').trim().substring(0, 50);
    const payload = {
      message: trimmedMsg,
      author_name: fallbackName,
      badge: (note.badge || fallbackName).trim().substring(0, 50),
      color_class: note.color_class || 'note-card-yellow',
      top: note.top || '100px',
      left: note.left || '100px',
      rotate: typeof note.rotate === 'number' ? note.rotate : 0,
    };

    const { data, error } = await supabase
      .from('sticky_notes')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Insert sticky note error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('[Supabase] Insert exception:', err);
    return { data: null, error: err.message || 'Database insert failed' };
  }
};

/* ── Testimonials Service ─────────────────────────────────────────────── */

export interface TestimonialRecord {
  id?: string;
  name: string;
  role?: string;
  company?: string;
  message: string;
  avatar_url?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export const fetchApprovedTestimonialsFromDB = async (): Promise<{
  data: TestimonialRecord[];
  error: string | null;
}> => {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('[Supabase] Error fetching testimonials:', error.message);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    console.warn('[Supabase] Fetch testimonials exception:', err);
    return { data: [], error: err.message || 'Network error' };
  }
};

export const createTestimonialInDB = async (
  testimonial: Omit<TestimonialRecord, 'id' | 'status' | 'created_at'>
): Promise<{ data: TestimonialRecord | null; error: string | null }> => {
  // Input Validation
  const name = testimonial.name?.trim();
  const message = testimonial.message?.trim();

  if (!name) {
    return { data: null, error: 'Your name is required.' };
  }
  if (name.length > 100) {
    return { data: null, error: 'Name must be 100 characters or fewer.' };
  }
  if (!message) {
    return { data: null, error: 'Testimonial message cannot be empty.' };
  }
  if (message.length > 1000) {
    return { data: null, error: 'Testimonial message exceeds 1000 character limit.' };
  }

  const rating = Math.max(1, Math.min(5, testimonial.rating || 5));

  if (!isSupabaseConfigured) {
    const localPending: TestimonialRecord = {
      id: `pending-local-${Date.now()}`,
      name,
      role: testimonial.role?.trim() || 'Software Engineer',
      company: testimonial.company?.trim() || 'Tech Corp',
      message,
      rating,
      avatar_url: testimonial.avatar_url || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    return { data: localPending, error: null };
  }

  try {
    const payload = {
      name,
      role: testimonial.role?.trim().substring(0, 100) || 'Peer / Client',
      company: testimonial.company?.trim().substring(0, 100) || '',
      message,
      rating,
      avatar_url: testimonial.avatar_url?.trim() || '',
      status: 'pending', // Strictly enforced default
    };

    const { data, error } = await supabase
      .from('testimonials')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Insert testimonial error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('[Supabase] Insert testimonial exception:', err);
    return { data: null, error: err.message || 'Database submission failed' };
  }
};

/* ── Portfolio Reels Service ─────────────────────────────────────────── */

export interface PortfolioReelRecord {
  id: string;
  asset_key: string;
  title: string;
  description: string;
  category: 'corporateand-fun' | 'poetryand-feeling';
  video_path: string;
  thumbnail_path?: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
}

const LOCAL_FALLBACK_REELS: Record<'corporateand-fun' | 'poetryand-feeling', PortfolioReelRecord[]> = {
  'corporateand-fun': [
    {
      id: 'local-corp-01',
      asset_key: 'corporate-01',
      title: 'Standup Chronicles: The Sync',
      description: 'When a 15-minute morning check-in transforms into an impromptu deep-dive architectural debate.',
      category: 'corporateand-fun',
      video_path: '/optimized-reels/corporateand-fun/corporate-01.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/corporateand-fun/corporate-01.jpg',
      sort_order: 1,
      is_published: true,
    },
    {
      id: 'local-corp-02',
      asset_key: 'corporate-02',
      title: 'Fueling The Sprint',
      description: 'The sacred routine: converting hot espresso into pixel-perfect frontend micro-interactions.',
      category: 'corporateand-fun',
      video_path: '/optimized-reels/corporateand-fun/corporate-02.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/corporateand-fun/corporate-02.jpg',
      sort_order: 2,
      is_published: true,
    },
    {
      id: 'local-corp-03',
      asset_key: 'corporate-03',
      title: 'Shipping on Friday 5 PM',
      description: 'That adrenaline spike when production deployment passes all green without a hitch.',
      category: 'corporateand-fun',
      video_path: '/optimized-reels/corporateand-fun/corporate-03.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/corporateand-fun/corporate-03.jpg',
      sort_order: 3,
      is_published: true,
    },
    {
      id: 'local-corp-04',
      asset_key: 'corporate-04',
      title: 'Design Critique Vibes',
      description: 'Collaborative brainstorms where daring UI ideas turn into tested design system components.',
      category: 'corporateand-fun',
      video_path: '/optimized-reels/corporateand-fun/corporate-04.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/corporateand-fun/corporate-04.jpg',
      sort_order: 4,
      is_published: true,
    },
    {
      id: 'local-corp-05',
      asset_key: 'corporate-05',
      title: 'Off-Clock Shenanigans',
      description: 'The lighthearted side between code reviews — keeping the energy vibrant and the spirits high.',
      category: 'corporateand-fun',
      video_path: '/optimized-reels/corporateand-fun/corporate-05.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/corporateand-fun/corporate-05.jpg',
      sort_order: 5,
      is_published: true,
    },
  ],
  'poetryand-feeling': [
    {
      id: 'local-poet-02',
      asset_key: 'poetry-02',
      title: 'Echoes of the Night',
      description: 'Late night musings under distant city lights when solitary thoughts shape into gentle verses.',
      category: 'poetryand-feeling',
      video_path: '/optimized-reels/poetryand-feeling/poetry-02.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/poetryand-feeling/poetry-02.jpg',
      sort_order: 1,
      is_published: true,
    },
    {
      id: 'local-poet-03',
      asset_key: 'poetry-03',
      title: 'A Letter to Tomorrow',
      description: 'Verses on hope, inner resilience, and finding quiet harmony amid the relentless digital noise.',
      category: 'poetryand-feeling',
      video_path: '/optimized-reels/poetryand-feeling/poetry-03.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/poetryand-feeling/poetry-03.jpg',
      sort_order: 2,
      is_published: true,
    },
    {
      id: 'local-poet-01',
      asset_key: 'poetry-01',
      title: 'Whispers of the Monsoon',
      description: 'Reflections on quiet rainfall, nostalgia, and the unspoken words lingering between pauses.',
      category: 'poetryand-feeling',
      video_path: '/optimized-reels/poetryand-feeling/poetry-01.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/poetryand-feeling/poetry-01.jpg',
      sort_order: 3,
      is_published: true,
    },
    {
      id: 'local-poet-04',
      asset_key: 'poetry-04',
      title: 'Shades of Silence',
      description: 'A heartfelt recital exploring the profound comfort discovered in tranquil, peaceful stillness.',
      category: 'poetryand-feeling',
      video_path: '/optimized-reels/poetryand-feeling/poetry-04.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/poetryand-feeling/poetry-04.jpg',
      sort_order: 4,
      is_published: true,
    },
    {
      id: 'local-poet-05',
      asset_key: 'poetry-05',
      title: 'The Soul of Words',
      description: 'Unfiltered emotional expression woven through rhythm, cadence, and heartfelt vulnerability.',
      category: 'poetryand-feeling',
      video_path: '/optimized-reels/poetryand-feeling/poetry-05.mp4',
      thumbnail_path: '/optimized-reels/thumbnails/poetryand-feeling/poetry-05.jpg',
      sort_order: 5,
      is_published: true,
    },
  ],
};

export const fetchReelsByCategory = async (
  category: 'corporateand-fun' | 'poetryand-feeling'
): Promise<{ data: PortfolioReelRecord[]; error: string | null; isFallback?: boolean }> => {
  if (!isSupabaseConfigured) {
    return { data: LOCAL_FALLBACK_REELS[category] || [], error: null, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_reels')
      .select('id, asset_key, title, description, category, video_path, thumbnail_path, sort_order, is_published, created_at')
      .eq('category', category)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] portfolio_reels query error:', error.message);
      // Fallback to local verified optimized reels if DB migration is pending in user project
      return { data: LOCAL_FALLBACK_REELS[category] || [], error: error.message, isFallback: true };
    }

    if (!data || data.length === 0) {
      // If table exists but has no records yet, use local fallback
      return { data: LOCAL_FALLBACK_REELS[category] || [], error: null, isFallback: true };
    }

    // Resolve any raw storage relative paths to public URLs
    const resolved: PortfolioReelRecord[] = data.map((item: any) => {
      let videoUrl = item.video_path;
      let thumbUrl = item.thumbnail_path;

      if (videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
        const { data: pubUrl } = supabase.storage.from('portfolio-reels').getPublicUrl(videoUrl);
        videoUrl = pubUrl.publicUrl;
      }

      if (thumbUrl && !thumbUrl.startsWith('http') && !thumbUrl.startsWith('/')) {
        const { data: pubThumb } = supabase.storage.from('portfolio-reels').getPublicUrl(thumbUrl);
        thumbUrl = pubThumb.publicUrl;
      }

      return {
        ...item,
        video_path: videoUrl,
        thumbnail_path: thumbUrl,
      };
    });

    return { data: resolved, error: null, isFallback: false };
  } catch (err: any) {
    console.warn('[Supabase] Fetch reels exception:', err);
    return { data: LOCAL_FALLBACK_REELS[category] || [], error: err.message || 'Network error', isFallback: true };
  }
};

