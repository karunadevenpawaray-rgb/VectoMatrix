export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          auth_id: string | null
          name: string
          logo_url: string | null
          email: string
          phone: string
          is_verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_id?: string | null
          name: string
          logo_url?: string | null
          email: string
          phone: string
          is_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string | null
          name?: string
          logo_url?: string | null
          email?: string
          phone?: string
          is_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      packages: {
        Row: {
          id: string
          agency_id: string | null
          title: string
          destination: Database["public"]["Enums"]["destination"]
          base_price_mur: number
          travel_month: string
          hotel_name: string
          hotel_stars: number
          hotel_location: string
          baggage_allowance: string
          transfer_type: string
          is_active: boolean | null
          is_archived: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          agency_id?: string | null
          title: string
          destination: Database["public"]["Enums"]["destination"]
          base_price_mur: number
          travel_month: string
          hotel_name: string
          hotel_stars: number
          hotel_location: string
          baggage_allowance: string
          transfer_type: string
          is_active?: boolean | null
          is_archived?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          agency_id?: string | null
          title?: string
          destination?: Database["public"]["Enums"]["destination"]
          base_price_mur?: number
          travel_month?: string
          hotel_name?: string
          hotel_stars?: number
          hotel_location?: string
          baggage_allowance?: string
          transfer_type?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      package_departures: {
        Row: {
          id: string
          package_id: string | null
          departure_date: string
          return_date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          package_id?: string | null
          departure_date: string
          return_date: string
          created_at?: string | null
        }
        Update: {
          id?: string
          package_id?: string | null
          departure_date?: string
          return_date?: string
          created_at?: string | null
        }
      }
      itinerary_days: {
        Row: {
          id: string
          package_id: string | null
          day_number: number
          title: string
          description: string
        }
        Insert: {
          id?: string
          package_id?: string | null
          day_number: number
          title: string
          description: string
        }
        Update: {
          id?: string
          package_id?: string | null
          day_number?: number
          title?: string
          description?: string
        }
      }
      insurance_addons: {
        Row: {
          id: string
          tier_name: string
          carrier_name: string
          price_mur: number
          medical_limit: string
          luggage_cover: string
          is_default: boolean | null
        }
        Insert: {
          id?: string
          tier_name: string
          carrier_name: string
          price_mur: number
          medical_limit: string
          luggage_cover: string
          is_default?: boolean | null
        }
        Update: {
          id?: string
          tier_name?: string
          carrier_name?: string
          price_mur?: number
          medical_limit?: string
          luggage_cover?: string
          is_default?: boolean | null
        }
      }
      leads: {
        Row: {
          id: string
          package_id: string | null
          assigned_agency_id: string | null
          client_name: string
          client_email: string
          client_phone: string
          passenger_count: number | null
          selected_insurance: string
          include_esim: boolean | null
          upgrade_private_car: boolean | null
          calculated_total_mur: number
          status: Database["public"]["Enums"]["lead_status"] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          package_id?: string | null
          assigned_agency_id?: string | null
          client_name: string
          client_email: string
          client_phone: string
          passenger_count?: number | null
          selected_insurance: string
          include_esim?: boolean | null
          upgrade_private_car?: boolean | null
          calculated_total_mur: number
          status?: Database["public"]["Enums"]["lead_status"] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          package_id?: string | null
          assigned_agency_id?: string | null
          client_name?: string
          client_email?: string
          client_phone?: string
          passenger_count?: number | null
          selected_insurance?: string
          include_esim?: boolean | null
          upgrade_private_car?: boolean | null
          calculated_total_mur?: number
          status?: Database["public"]["Enums"]["lead_status"] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      destination: "MALAYSIA" | "DUBAI" | "SOUTH_AFRICA" | "RODRIGUES" | "REUNION"
      lead_status: "PENDING" | "CLAIMED" | "CONVERTED" | "LOST"
    }
  }
}
