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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          messages: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_likes: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_likes_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "shared_experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      found_reports: {
        Row: {
          breed: string | null
          color: string | null
          contact_email: string | null
          contact_phone: string
          created_at: string
          description: string | null
          found_date: string
          found_location: string
          id: string
          images: string[] | null
          pet_type: Database["public"]["Enums"]["pet_type"]
          status: Database["public"]["Enums"]["report_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breed?: string | null
          color?: string | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          description?: string | null
          found_date: string
          found_location: string
          id?: string
          images?: string[] | null
          pet_type: Database["public"]["Enums"]["pet_type"]
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breed?: string | null
          color?: string | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          description?: string | null
          found_date?: string
          found_location?: string
          id?: string
          images?: string[] | null
          pet_type?: Database["public"]["Enums"]["pet_type"]
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lost_reports: {
        Row: {
          age: string | null
          breed: string | null
          color: string | null
          contact_email: string | null
          contact_phone: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          last_seen_date: string
          last_seen_location: string
          pet_name: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          reward: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: string | null
          breed?: string | null
          color?: string | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          last_seen_date: string
          last_seen_location: string
          pet_name: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          reward?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: string | null
          breed?: string | null
          color?: string | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          last_seen_date?: string
          last_seen_location?: string
          pet_name?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          reward?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_phone: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          store_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          store_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          store_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "seller_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_diseases: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          prevention: string | null
          symptoms: string[] | null
          when_to_seek_help: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          prevention?: string | null
          symptoms?: string[] | null
          when_to_seek_help?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          prevention?: string | null
          symptoms?: string[] | null
          when_to_seek_help?: string | null
        }
        Relationships: []
      }
      pet_guides: {
        Row: {
          age_group: string | null
          category: string
          content: string
          created_at: string
          gender: string | null
          id: string
          image_url: string | null
          pet_type: Database["public"]["Enums"]["pet_type"]
          title: string
        }
        Insert: {
          age_group?: string | null
          category: string
          content: string
          created_at?: string
          gender?: string | null
          id?: string
          image_url?: string | null
          pet_type: Database["public"]["Enums"]["pet_type"]
          title: string
        }
        Update: {
          age_group?: string | null
          category?: string
          content?: string
          created_at?: string
          gender?: string | null
          id?: string
          image_url?: string | null
          pet_type?: Database["public"]["Enums"]["pet_type"]
          title?: string
        }
        Relationships: []
      }
      pet_love: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          title?: string
        }
        Relationships: []
      }
      pet_matches: {
        Row: {
          created_at: string
          found_report_id: string
          id: string
          lost_report_id: string
          match_score: number | null
          notified: boolean | null
          status: string | null
        }
        Insert: {
          created_at?: string
          found_report_id: string
          id?: string
          lost_report_id: string
          match_score?: number | null
          notified?: boolean | null
          status?: string | null
        }
        Update: {
          created_at?: string
          found_report_id?: string
          id?: string
          lost_report_id?: string
          match_score?: number | null
          notified?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_matches_found_report_id_fkey"
            columns: ["found_report_id"]
            isOneToOne: false
            referencedRelation: "found_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_matches_lost_report_id_fkey"
            columns: ["lost_report_id"]
            isOneToOne: false
            referencedRelation: "lost_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pets_info: {
        Row: {
          animal_name: string
          can_keep: boolean
          created_at: string
          ethical_notes: string | null
          id: string
          image_url: string | null
          legal_notes: string | null
          reason: string | null
        }
        Insert: {
          animal_name: string
          can_keep: boolean
          created_at?: string
          ethical_notes?: string | null
          id?: string
          image_url?: string | null
          legal_notes?: string | null
          reason?: string | null
        }
        Update: {
          animal_name?: string
          can_keep?: boolean
          created_at?: string
          ethical_notes?: string | null
          id?: string
          image_url?: string | null
          legal_notes?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          pet_type: Database["public"]["Enums"]["pet_type"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          compare_price: number | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_approved: boolean | null
          name: string
          pet_type: Database["public"]["Enums"]["pet_type"] | null
          price: number
          stock_quantity: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_approved?: boolean | null
          name: string
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
          price: number
          stock_quantity?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_approved?: boolean | null
          name?: string
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
          price?: number
          stock_quantity?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "seller_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_stores: {
        Row: {
          address: string | null
          banner_url: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          phone: string | null
          store_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          phone?: string | null
          store_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          phone?: string | null
          store_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_experiences: {
        Row: {
          content: string
          created_at: string
          id: string
          images: string[] | null
          likes_count: number | null
          pet_type: Database["public"]["Enums"]["pet_type"] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number | null
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number | null
          pet_type?: Database["public"]["Enums"]["pet_type"] | null
          title?: string
          updated_at?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "seller" | "admin"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      pet_type:
        | "dog"
        | "cat"
        | "bird"
        | "rabbit"
        | "fish"
        | "hamster"
        | "reptile"
        | "other"
      report_status: "active" | "resolved" | "expired"
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
      app_role: ["user", "seller", "admin"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      pet_type: [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "fish",
        "hamster",
        "reptile",
        "other",
      ],
      report_status: ["active", "resolved", "expired"],
    },
  },
} as const
