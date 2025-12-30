import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://xxxx.supabase.co'
const SUPABASE_KEY = 'public-anon-key'

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

export const projects = [
  createClient(
    "https://gewpurkaeeixoxpkvkpf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld3B1cmthZWVpeG94cGt2a3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTY4MzEsImV4cCI6MjA4MjY5MjgzMX0.gyx7wYOj8svan1l9xebzI8h9bEFfJpf3FGOLdrnevys"
  ),
  createClient(
    "https://wffpnyghglmzeqqqtnzi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZnBueWdoZ2xtemVxcXF0bnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTcyMDMsImV4cCI6MjA4MjY5MzIwM30.DOzF_qOHPOzSK4tYZ8Kpf-5qzjCenognwiVqXvFkGho"
  ),
  createClient(
    "https://karzkluhbqgtkwjyadiz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnprbHVoYnFndGt3anlhZGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTczOTksImV4cCI6MjA4MjY5MzM5OX0.LTi-tE-oLVgQQLFNQRRFMlbjiIUz9X0TFqCDm53Oa18"
  ),
  createClient(
    "https://slmzhqsplmsjzdlevqyb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbXpocXNwbG1zanpkbGV2cXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTc0MDUsImV4cCI6MjA4MjY5MzQwNX0.90YRE5r46YDoKuef9g8sMPGXDDRGigxX4FVCYrWuEEk"
  ),
  createClient(
    "https://plawlwsdcdkekszfxeqt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYXdsd3NkY2RrZWtzemZ4ZXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTc1NTgsImV4cCI6MjA4MjY5MzU1OH0.wgwD_yI5nJ0DkLrbkd2DsCZ8o9wUKY3plHOs7BzEmB0"
  ),
  createClient(
    "https://dzvwgikkftfjtwkwvuij.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dndnaWtrZnRmanR3a3d2dWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTgwMDEsImV4cCI6MjA4MjY5NDAwMX0.KKku_wsMFZiWy8nthPmt3L9B9LN6baLVB5rZJjyWymI"
  )
]

export function boardToProject(boardId){
  const index=Math.floor((boardId-1)/15)
  return projects[index]
}

// 管理者用Supabase
export const adminSupabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export function sanitizeInput(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
export function debugLog(msg) {
  const el = document.getElementById("debug");
  if (!el) return;
  const line = document.createElement("div");
  line.textContent =
    "[" + new Date().toLocaleTimeString() + "] " + msg;
  el.appendChild(line);
}
