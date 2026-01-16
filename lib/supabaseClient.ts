import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use placeholder values if not configured (for demo mode)
const url = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL')
    ? supabaseUrl
    : 'https://placeholder.supabase.co'

const key = (supabaseAnonKey && supabaseAnonKey.startsWith('eyJ'))
    ? supabaseAnonKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
    console.warn('Supabase URL or Key missing in environment variables. Running in demo mode.')
}

export const supabase = createClient(url, key)
