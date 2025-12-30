import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://xxxx.supabase.co'
const SUPABASE_KEY = 'public-anon-key'

export const projects = [
  createClient(SUPABASE_URL, SUPABASE_KEY),
  createClient(SUPABASE_URL, SUPABASE_KEY),
  createClient(SUPABASE_URL, SUPABASE_KEY),
  createClient(SUPABASE_URL, SUPABASE_KEY),
  createClient(SUPABASE_URL, SUPABASE_KEY),
  createClient(SUPABASE_URL, SUPABASE_KEY),
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
