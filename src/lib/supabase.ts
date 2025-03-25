
import { createClient } from '@supabase/supabase-js';

// For development, use these placeholder values if environment variables are not set
// In production, these should be set as proper environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-placeholder';

// Instead of showing an error, display a warning for development
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using placeholder Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          points: number;
          category: string;
          requirements: string;
          badge_image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          points: number;
          category: string;
          requirements: string;
          badge_image?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          points?: number;
          category?: string;
          requirements?: string;
          badge_image?: string;
          created_at?: string;
        };
      };
      scouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          rank_id: number;
          points: number;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          rank_id?: number;
          points?: number;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          rank_id?: number;
          points?: number;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      scout_achievements: {
        Row: {
          id: string;
          scout_id: string;
          achievement_id: string;
          status: 'pending' | 'approved' | 'rejected';
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scout_id: string;
          achievement_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          approved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          scout_id?: string;
          achievement_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          approved_at?: string | null;
          created_at?: string;
        };
      };
      ranks: {
        Row: {
          id: number;
          name: string;
          color: string;
          min_points: number;
          image: string;
          description: string;
        };
        Insert: {
          id?: number;
          name: string;
          color: string;
          min_points: number;
          image?: string;
          description: string;
        };
        Update: {
          id?: number;
          name?: string;
          color?: string;
          min_points?: number;
          image?: string;
          description?: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string;
          points_required: number;
          image: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          points_required: number;
          image?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          points_required?: number;
          image?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_points: {
        Args: {
          row_id: string;
          points_to_add: number;
        };
        Returns: number;
      };
    };
  };
};
