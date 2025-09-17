-- Run this on your Postgres (Supabase) to create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id bigint PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  title json,
  description json,
  "image url" json,
  tags json
);
