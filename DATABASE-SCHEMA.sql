-- ==========================================
-- 🎯 PLIPLI9 PARANORMAL - DATABASE SCHEMA
-- ==========================================
-- Cloud Database: PlanetScale MySQL
-- Architecture: Resilient 8-hour access codes + Live sessions tracking
-- Date: 2024-12-20

-- ==========================================
-- 📋 TABLE: access_codes
-- Purpose: Store 8-hour flexible access codes
-- ==========================================
CREATE TABLE access_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(12) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NULL, -- pentru WhatsApp notifications
  payment_intent_id VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL, -- created_at + 8 hours
  status ENUM('active', 'expired') DEFAULT 'active',
  last_used_at TIMESTAMP NULL,
  usage_count INT DEFAULT 0,
  ip_address VARCHAR(45) NULL,
  
  -- Indexes pentru performance
  INDEX idx_code (code),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at),
  INDEX idx_created_at (created_at)
);

-- ==========================================
-- 🎥 TABLE: live_sessions  
-- Purpose: Track live streaming sessions (independent de access codes)
-- ==========================================
CREATE TABLE live_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  stream_key VARCHAR(255) NOT NULL,
  stream_url VARCHAR(255) NULL, -- RTMP URL for streaming
  playback_url VARCHAR(255) NULL, -- HLS URL for viewing
  location VARCHAR(255) NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  status ENUM('active', 'paused', 'ended') DEFAULT 'active',
  estimated_duration INT DEFAULT 120, -- minutes
  viewer_count INT DEFAULT 0,
  stream_source ENUM('mobile', 'desktop') DEFAULT 'mobile',
  
  -- Indexes pentru performance
  INDEX idx_session_id (session_id),
  INDEX idx_status (status),
  INDEX idx_started_at (started_at),
  INDEX idx_stream_source (stream_source)
);

-- ==========================================
-- 💬 TABLE: chat_messages
-- Purpose: Store persistent chat messages pentru live sessions
-- ==========================================
CREATE TABLE chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,
  
  -- Indexes pentru performance
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (timestamp),
  
  -- Foreign key relationship (optional, dacă vrei să enforci consistency)
  FOREIGN KEY (session_id) REFERENCES live_sessions(session_id) ON DELETE CASCADE
);

-- ==========================================
-- 📊 TABLE: analytics_events (Optional)
-- Purpose: Track user events pentru analytics
-- ==========================================
CREATE TABLE analytics_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL, -- 'payment', 'access_used', 'live_joined', 'chat_sent'
  user_identifier VARCHAR(255) NULL, -- email sau access code
  session_id VARCHAR(50) NULL,
  event_data JSON NULL, -- detalii suplimentare
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes pentru analytics queries
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_identifier (user_identifier),
  INDEX idx_session_id (session_id)
);

-- ==========================================
-- 🔧 SAMPLE DATA pentru testing
-- ==========================================

-- Sample access codes pentru testing
INSERT INTO access_codes (code, email, phone_number, amount, payment_method, expires_at, status, usage_count) VALUES
('PLI001TEST', 'test@example.com', '+40712345678', 25.00, 'stripe', DATE_ADD(NOW(), INTERVAL 8 HOUR), 'active', 0),
('PLI002TEST', 'demo@example.com', '+40712345679', 25.00, 'paypal', DATE_ADD(NOW(), INTERVAL 8 HOUR), 'active', 0);

-- Sample live session pentru testing
INSERT INTO live_sessions (session_id, stream_key, stream_url, playback_url, location, status, estimated_duration, stream_source) VALUES
('live_test_001', 'test_stream_key_123', 'rtmp://rtmp.livepeer.com/live/test_stream_key_123', 'https://lvpr.tv?v=test_playback_id', 'Castelul Test', 'active', 120, 'mobile');

-- Sample chat messages pentru testing
INSERT INTO chat_messages (session_id, username, message) VALUES
('live_test_001', 'TestUser1', 'Salut! Se vede bine stream-ul!'),
('live_test_001', 'TestUser2', 'Foarte tare experiența! 👻'),
('live_test_001', 'Admin', 'Bună tuturor! Să începem investigația...');

-- ==========================================
-- 🔍 USEFUL QUERIES pentru monitoring
-- ==========================================

-- Get active access codes
-- SELECT * FROM access_codes WHERE status = 'active' AND expires_at > NOW();

-- Get current live session
-- SELECT * FROM live_sessions WHERE status = 'active' ORDER BY started_at DESC LIMIT 1;

-- Get access codes expiring in next 2 hours
-- SELECT * FROM access_codes WHERE status = 'active' AND expires_at > NOW() AND expires_at <= DATE_ADD(NOW(), INTERVAL 2 HOUR);

-- Get chat messages for current session
-- SELECT * FROM chat_messages WHERE session_id = (SELECT session_id FROM live_sessions WHERE status = 'active' ORDER BY started_at DESC LIMIT 1) ORDER BY timestamp DESC LIMIT 50;

-- Analytics: Payment summary
-- SELECT DATE(created_at) as date, COUNT(*) as payments, SUM(amount) as total_revenue FROM access_codes GROUP BY DATE(created_at) ORDER BY date DESC;

-- Analytics: Popular session times
-- SELECT HOUR(started_at) as hour, COUNT(*) as sessions FROM live_sessions GROUP BY HOUR(started_at) ORDER BY sessions DESC; 