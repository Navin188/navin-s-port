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
