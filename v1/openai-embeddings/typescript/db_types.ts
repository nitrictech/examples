export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      page: {
        Row: {
          id: number;
          path: string | null;
        };
        Insert: {
          id?: never;
          path?: string | null;
        };
        Update: {
          id?: never;
          path?: string | null;
        };
      };
      page_section: {
        Row: {
          content: string;
          embedding: number[] | null;
          id: number;
          page_id: number | null;
          token_count: number;
        };
        Insert: {
          content: string;
          embedding?: number[] | null;
          id?: number;
          page_id?: number | null;
          token_count: number;
        };
        Update: {
          content?: string;
          embedding?: number[] | null;
          id?: number;
          page_id?: number | null;
          token_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_page_sections: {
        Args: {
          embedding: number[];
          match_threshold: number;
          match_count: number;
          min_content_length: number;
        };
        Returns: {
          path: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
