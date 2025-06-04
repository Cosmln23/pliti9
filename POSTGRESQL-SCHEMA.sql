-- ==========================================
-- 🎯 PLIPLI9 PARANORMAL - POSTGRESQL SCHEMA
-- ==========================================
-- Cloud Database: Railway PostgreSQL
-- Architecture: Resilient 8-hour access codes + Live sessions tracking
-- Date: 2024-12-20

-- ==========================================
-- 📋 TABLE: access_codes
-- Purpose: Store 8-hour flexible access codes
-- ==========================================
CREATE TABLE access_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NULL,
  payment_intent_id VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  usage_count INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 3,
  ip_address INET,
  
  -- Session tracking pentru ONE-TIME device limit
  active_session_id VARCHAR(255),
  active_device_info JSONB,
  last_activity_at TIMESTAMP,
  session_started_at TIMESTAMP,
  previous_sessions JSONB DEFAULT '[]'::jsonb,
  
  -- Indexuri pentru performance
  CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'used', 'in_use', 'suspended'))
);

-- Indexes pentru performance
CREATE INDEX idx_access_codes_code ON access_codes (code);
CREATE INDEX idx_access_codes_email ON access_codes (email);
CREATE INDEX idx_access_codes_status ON access_codes (status);
CREATE INDEX idx_access_codes_expires_at ON access_codes (expires_at);
CREATE INDEX idx_access_codes_created_at ON access_codes (created_at);

-- ==========================================
-- 🎥 TABLE: live_sessions  
-- Purpose: Track live streaming sessions (independent de access codes)
-- ==========================================
CREATE TABLE live_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  stream_key VARCHAR(255) NOT NULL,
  stream_url VARCHAR(255) NULL,
  playback_url VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  estimated_duration INTEGER DEFAULT 120,
  viewer_count INTEGER DEFAULT 0,
  stream_source VARCHAR(20) DEFAULT 'mobile' CHECK (stream_source IN ('mobile', 'desktop'))
);

-- Indexes pentru performance
CREATE INDEX idx_live_sessions_session_id ON live_sessions (session_id);
CREATE INDEX idx_live_sessions_status ON live_sessions (status);
CREATE INDEX idx_live_sessions_started_at ON live_sessions (started_at);
CREATE INDEX idx_live_sessions_stream_source ON live_sessions (stream_source);

-- ==========================================
-- 💬 TABLE: chat_messages
-- Purpose: Store persistent chat messages pentru live sessions
-- ==========================================
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL
);

-- Indexes pentru performance
CREATE INDEX idx_chat_messages_session_id ON chat_messages (session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages (timestamp);

-- Foreign key relationship
ALTER TABLE chat_messages 
ADD CONSTRAINT fk_chat_messages_session_id 
FOREIGN KEY (session_id) REFERENCES live_sessions(session_id) ON DELETE CASCADE;

-- ==========================================
-- 📊 TABLE: analytics_events (Optional)
-- Purpose: Track user events pentru analytics
-- ==========================================
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_identifier VARCHAR(255) NULL,
  session_id VARCHAR(50) NULL,
  event_data JSONB NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pentru analytics queries
CREATE INDEX idx_analytics_events_event_type ON analytics_events (event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events (timestamp);
CREATE INDEX idx_analytics_events_user_identifier ON analytics_events (user_identifier);
CREATE INDEX idx_analytics_events_session_id ON analytics_events (session_id);

-- ==========================================
-- 🔧 SAMPLE DATA pentru testing
-- ==========================================

-- Sample access codes pentru testing
INSERT INTO access_codes (code, email, phone_number, amount, payment_method, expires_at, status, usage_count) VALUES
('PLI001TEST', 'test@plipli9paranormal.com', '+40712345678', 25.00, 'stripe', NOW() + INTERVAL '8 hours', 'active', 0),
('PLI002TEST', 'demo@plipli9paranormal.com', '+40712345679', 25.00, 'paypal', NOW() + INTERVAL '8 hours', 'active', 0);

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
-- SELECT * FROM access_codes WHERE status = 'active' AND expires_at > NOW() AND expires_at <= NOW() + INTERVAL '2 hours';

-- Get chat messages for current session
-- SELECT * FROM chat_messages WHERE session_id = (SELECT session_id FROM live_sessions WHERE status = 'active' ORDER BY started_at DESC LIMIT 1) ORDER BY timestamp DESC LIMIT 50;

-- Analytics: Payment summary
-- SELECT DATE(created_at) as date, COUNT(*) as payments, SUM(amount) as total_revenue FROM access_codes GROUP BY DATE(created_at) ORDER BY date DESC;

-- Analytics: Popular session times
-- SELECT EXTRACT(HOUR FROM started_at) as hour, COUNT(*) as sessions FROM live_sessions GROUP BY EXTRACT(HOUR FROM started_at) ORDER BY sessions DESC; 