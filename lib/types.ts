export type UserRole = "super_admin" | "admin" | "operator"
export type VoucherStatus = "available" | "sold" | "activated" | "expired" | "revoked"
export type PaymentProvider = "mpesa" | "airtel_money" | "tigo_pesa" | "halopesa"
export type TransactionStatus = "pending" | "completed" | "failed" | "reversed"

export interface AdminUser {
  id: number
  username: string
  email: string
  password_hash: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: Date
  updated_at: Date
  last_login: Date | null
}

export interface Package {
  id: number
  package_name: string
  description: string | null
  data_limit_mb: number
  speed_limit_kbps: number | null
  validity_hours: number
  price: number
  currency: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  created_by: number | null
}

export interface Voucher {
  id: number
  voucher_code: string
  package_id: number
  status: VoucherStatus
  purchase_reference: string | null
  phone_number: string | null
  payment_provider: PaymentProvider | null
  amount_paid: number | null
  purchased_at: Date | null
  activated_at: Date | null
  expires_at: Date | null
  mac_address: string | null
  pfsense_username: string | null
  created_at: Date
  created_by: number | null
}

export interface Transaction {
  id: number
  transaction_reference: string
  voucher_id: number | null
  phone_number: string
  amount: number
  currency: string
  payment_provider: PaymentProvider
  status: TransactionStatus
  provider_transaction_id: string | null
  callback_received_at: Date | null
  callback_data: any
  error_message: string | null
  created_at: Date
  updated_at: Date
}

export interface VoucherUsage {
  id: number
  voucher_id: number
  session_id: string | null
  bytes_uploaded: number
  bytes_downloaded: number
  session_start: Date | null
  session_end: Date | null
  ip_address: string | null
  recorded_at: Date
}

export interface SystemSetting {
  id: number
  setting_key: string
  setting_value: string
  description: string | null
  updated_at: Date
  updated_by: number | null
}

export interface AuditLog {
  id: number
  admin_user_id: number | null
  action: string
  table_name: string | null
  record_id: number | null
  old_values: any
  new_values: any
  ip_address: string | null
  user_agent: string | null
  created_at: Date
}
