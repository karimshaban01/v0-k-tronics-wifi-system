-- Seed initial data for K-TRONICS WIFI System

-- Create default super admin (password: Admin@123 - CHANGE THIS!)
-- Password hash for 'Admin@123' using bcrypt
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
VALUES (
  'admin',
  'admin@ktronics.com',
  '$2b$10$rQZ5vE3P6qH5F8tJ9eX5.eLKh3xX9YvXqH5F8tJ9eX5eLKh3xX9YvX',
  'System Administrator',
  'super_admin',
  TRUE
);

-- Create default packages
INSERT INTO packages (package_name, description, data_limit_mb, speed_limit_kbps, validity_hours, price, is_active, created_by) 
VALUES 
  ('Hourly 500MB', 'Perfect for quick browsing - 500MB data valid for 1 hour', 500, 2048, 1, 500.00, TRUE, 1),
  ('Daily 1GB', 'Stay connected all day - 1GB data valid for 24 hours', 1024, 4096, 24, 1500.00, TRUE, 1),
  ('Daily 2GB', 'Heavy usage package - 2GB data valid for 24 hours', 2048, 4096, 24, 2500.00, TRUE, 1),
  ('Weekly 5GB', 'Weekly package - 5GB data valid for 7 days', 5120, 4096, 168, 5000.00, TRUE, 1),
  ('Weekly 10GB', 'Premium weekly - 10GB data valid for 7 days', 10240, 8192, 168, 9000.00, TRUE, 1),
  ('Monthly 30GB', 'Monthly standard - 30GB data valid for 30 days', 30720, 8192, 720, 25000.00, TRUE, 1),
  ('Monthly 50GB', 'Monthly premium - 50GB data valid for 30 days', 51200, 10240, 720, 40000.00, TRUE, 1);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('pfsense_api_url', 'https://your-pfsense-ip/api/v1', 'pfSense API base URL'),
  ('pfsense_api_key', '', 'pfSense API key (configure in settings)'),
  ('pfsense_api_secret', '', 'pfSense API secret (configure in settings)'),
  ('company_name', 'K-TRONICS', 'Company name displayed on voucher portal'),
  ('company_logo_url', '/logo.png', 'URL to company logo'),
  ('support_phone', '+255 XXX XXX XXX', 'Support phone number'),
  ('support_email', 'support@ktronics.com', 'Support email address'),
  ('mpesa_api_enabled', 'false', 'Enable M-Pesa payment integration'),
  ('mpesa_shortcode', '', 'M-Pesa business shortcode'),
  ('mpesa_consumer_key', '', 'M-Pesa consumer key'),
  ('mpesa_consumer_secret', '', 'M-Pesa consumer secret'),
  ('airtel_api_enabled', 'false', 'Enable Airtel Money integration'),
  ('airtel_client_id', '', 'Airtel Money client ID'),
  ('airtel_client_secret', '', 'Airtel Money client secret'),
  ('tigo_api_enabled', 'false', 'Enable Tigo Pesa integration'),
  ('halopesa_api_enabled', 'false', 'Enable Halopesa integration'),
  ('auto_voucher_generation', 'true', 'Automatically generate voucher after payment'),
  ('voucher_code_prefix', 'KT', 'Prefix for generated voucher codes');
