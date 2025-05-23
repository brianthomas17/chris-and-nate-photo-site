export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communications: {
        Row: {
          code: string | null
          copy: string | null
          created_at: string
          id: string
          invitation_type: string[]
          prompt: string | null
          send_date: string
          title: string
          trigger: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          copy?: string | null
          created_at?: string
          id?: string
          invitation_type: string[]
          prompt?: string | null
          send_date: string
          title: string
          trigger: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          copy?: string | null
          created_at?: string
          id?: string
          invitation_type?: string[]
          prompt?: string | null
          send_date?: string
          title?: string
          trigger?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          title: string
          updated_at: string
          visible_to: Database["public"]["Enums"]["invitation_type"][]
          visible_to_afterparty: boolean
          visible_to_friday_dinner: boolean | null
          visible_to_main_event: boolean
          visible_to_sunday_brunch: boolean | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index: number
          title: string
          updated_at?: string
          visible_to: Database["public"]["Enums"]["invitation_type"][]
          visible_to_afterparty?: boolean
          visible_to_friday_dinner?: boolean | null
          visible_to_main_event?: boolean
          visible_to_sunday_brunch?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
          visible_to?: Database["public"]["Enums"]["invitation_type"][]
          visible_to_afterparty?: boolean
          visible_to_friday_dinner?: boolean | null
          visible_to_main_event?: boolean
          visible_to_sunday_brunch?: boolean | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          address: string | null
          afterparty: boolean
          attending: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string
          friday_dinner: boolean | null
          id: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          last_name: string | null
          main_event: boolean
          party_id: string | null
          party_name: string | null
          phone_number: string | null
          state: string | null
          sunday_brunch: boolean | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          afterparty?: boolean
          attending?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          friday_dinner?: boolean | null
          id?: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          last_name?: string | null
          main_event?: boolean
          party_id?: string | null
          party_name?: string | null
          phone_number?: string | null
          state?: string | null
          sunday_brunch?: boolean | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          afterparty?: boolean
          attending?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          friday_dinner?: boolean | null
          id?: string
          invitation_type?: Database["public"]["Enums"]["invitation_type"]
          last_name?: string | null
          main_event?: boolean
          party_id?: string | null
          party_name?: string | null
          phone_number?: string | null
          state?: string | null
          sunday_brunch?: boolean | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          id: string
          uploaded_by: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          uploaded_by: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string
          guest_id: string
          id: string
          updated_at: string
        }
        Insert: {
          attending: boolean
          created_at?: string
          guest_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          attending?: boolean
          created_at?: string
          guest_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: true
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      system_prompts: {
        Row: {
          created_at: string
          id: string
          name: string
          prompt_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prompt_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prompt_text?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      create_test_guest: {
        Args: {
          p_email: string
          p_first_name: string
          p_invitation_type: string
        }
        Returns: Json
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      invitation_type: "main event" | "afterparty" | "admin"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_type: ["main event", "afterparty", "admin"],
    },
  },
} as const
