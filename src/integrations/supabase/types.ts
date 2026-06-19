export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          payment_status: string
          placement: string
          status: Database["public"]["Enums"]["review_status"]
          telegram: string | null
          title: string
          tool_name: string
          updated_at: string
          website_url: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          full_name: string
          id?: string
          payment_status?: string
          placement: string
          status?: Database["public"]["Enums"]["review_status"]
          telegram?: string | null
          title: string
          tool_name: string
          updated_at?: string
          website_url: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          id?: string
          payment_status?: string
          placement?: string
          status?: Database["public"]["Enums"]["review_status"]
          telegram?: string | null
          title?: string
          tool_name?: string
          updated_at?: string
          website_url?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      ai_tools: {
        Row: {
          category_ids: string[]
          cons: Json
          created_at: string
          date_added: string
          discovery_source: string | null
          features: Json
          has_free_plan: boolean
          id: string
          is_featured: boolean
          is_trending: boolean
          languages: string[]
          logo_url: string | null
          name: string
          official_url: string | null
          overview: string | null
          platforms: string[]
          popularity_score: number
          pricing_model: string
          pros: Json
          short_description: string
          similar_tool_ids: string[]
          slug: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
          use_cases: Json
          verification_notes: string | null
        }
        Insert: {
          category_ids?: string[]
          cons?: Json
          created_at?: string
          date_added?: string
          discovery_source?: string | null
          features?: Json
          has_free_plan?: boolean
          id?: string
          is_featured?: boolean
          is_trending?: boolean
          languages?: string[]
          logo_url?: string | null
          name: string
          official_url?: string | null
          overview?: string | null
          platforms?: string[]
          popularity_score?: number
          pricing_model?: string
          pros?: Json
          short_description?: string
          similar_tool_ids?: string[]
          slug: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
          use_cases?: Json
          verification_notes?: string | null
        }
        Update: {
          category_ids?: string[]
          cons?: Json
          created_at?: string
          date_added?: string
          discovery_source?: string | null
          features?: Json
          has_free_plan?: boolean
          id?: string
          is_featured?: boolean
          is_trending?: boolean
          languages?: string[]
          logo_url?: string | null
          name?: string
          official_url?: string | null
          overview?: string | null
          platforms?: string[]
          popularity_score?: number
          pricing_model?: string
          pros?: Json
          short_description?: string
          similar_tool_ids?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
          use_cases?: Json
          verification_notes?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          tool_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          tool_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          tool_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      tool_discoveries: {
        Row: {
          candidate_url: string | null
          confidence_score: number
          created_at: string
          extracted_data: Json
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          source_type: string
          source_url: string
          status: Database["public"]["Enums"]["review_status"]
          tool_name: string
          updated_at: string
        }
        Insert: {
          candidate_url?: string | null
          confidence_score?: number
          created_at?: string
          extracted_data?: Json
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_type: string
          source_url: string
          status?: Database["public"]["Enums"]["review_status"]
          tool_name: string
          updated_at?: string
        }
        Update: {
          candidate_url?: string | null
          confidence_score?: number
          created_at?: string
          extracted_data?: Json
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_type?: string
          source_url?: string
          status?: Database["public"]["Enums"]["review_status"]
          tool_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      admin_tool_edits: {
        Row: {
          id: string
          original_name: string | null
          tool_data: Json
          action: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          original_name?: string | null
          tool_data?: Json
          action: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          original_name?: string | null
          tool_data?: Json
          action?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tool_submissions: {
        Row: {
          id: string
          tool_name: string
          tool_url: string
          description: string
          full_description: string | null
          category: string
          pricing: string
          submitter_name: string | null
          submitter_email: string | null
          logo_url: string | null
          tags: string[]
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tool_name: string
          tool_url: string
          description?: string
          full_description?: string | null
          category?: string
          pricing?: string
          submitter_name?: string | null
          submitter_email?: string | null
          logo_url?: string | null
          tags?: string[]
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tool_name?: string
          tool_url?: string
          description?: string
          full_description?: string | null
          category?: string
          pricing?: string
          submitter_name?: string | null
          submitter_email?: string | null
          logo_url?: string | null
          tags?: string[]
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
