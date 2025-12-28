-- K-TRONICS WIFI Voucher System Database Schema
-- Created: 2025-01-28

-- Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('super_admin', 'admin', 'operator') DEFAULT 'operator',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Table: packages
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  description TEXT,
  data_limit_mb INT NOT NULL COMMENT 'Data limit in MB',
  speed_limit_kbps INT COMMENT 'Speed limit in Kbps',
  validity_hours INT NOT NULL COMMENT 'Validity period in hours',
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TZS',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_active (is_active),
  INDEX idx_price (price)
);

-- Table: vouchers
CREATE TABLE IF NOT EXISTS vouchers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  voucher_code VARCHAR(20) UNIQUE NOT NULL,
  package_id INT NOT NULL,
  status ENUM('available', 'sold', 'activated', 'expired', 'revoked') DEFAULT 'available',
  purchase_reference VARCHAR(100) UNIQUE COMMENT 'Payment reference from Mobile Money',
  phone_number VARCHAR(20) COMMENT 'Customer phone number',
  payment_provider ENUM('mpesa', 'airtel_money', 'tigo_pesa', 'halopesa') NULL,
  amount_paid DECIMAL(10, 2),
  purchased_at TIMESTAMP NULL,
  activated_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  mac_address VARCHAR(17) COMMENT 'Device MAC address when activated',
  pfsense_username VARCHAR(50) COMMENT 'pfSense username created',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT COMMENT 'Admin who generated the voucher',
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_voucher_code (voucher_code),
  INDEX idx_status (status),
  INDEX idx_phone_number (phone_number),
  INDEX idx_purchase_reference (purchase_reference),
  INDEX idx_created_at (created_at)
);

-- Table: transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_reference VARCHAR(100) UNIQUE NOT NULL,
  voucher_id INT,
  phone_number VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TZS',
  payment_provider ENUM('mpesa', 'airtel_money', 'tigo_pesa', 'halopesa') NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'reversed') DEFAULT 'pending',
  provider_transaction_id VARCHAR(100) COMMENT 'Transaction ID from payment provider',
  callback_received_at TIMESTAMP NULL,
  callback_data JSON COMMENT 'Full callback data from provider',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE SET NULL,
  INDEX idx_reference (transaction_reference),
  INDEX idx_status (status),
  INDEX idx_phone_number (phone_number),
  INDEX idx_created_at (created_at)
);

-- Table: voucher_usage
CREATE TABLE IF NOT EXISTS voucher_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  voucher_id INT NOT NULL,
  session_id VARCHAR(100),
  bytes_uploaded BIGINT DEFAULT 0,
  bytes_downloaded BIGINT DEFAULT 0,
  session_start TIMESTAMP NULL,
  session_end TIMESTAMP NULL,
  ip_address VARCHAR(45),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
  INDEX idx_voucher_id (voucher_id),
  INDEX idx_session_id (session_id)
);

-- Table: system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_key (setting_key)
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_admin_user (admin_user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);
