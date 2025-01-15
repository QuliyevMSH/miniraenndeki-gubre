import { Tables } from './tables'

export interface Database {
  public: {
    Tables: Tables
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_product_with_baskets: {
        Args: {
          product_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}