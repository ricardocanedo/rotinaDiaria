// Import the Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize the Supabase client with your project's URL and anon key
const supabaseUrl = 'https://zfqkqtvhnqbeyykgfgky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcWtxdHZobnFiZXl5a2dmZ2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODY2NTMsImV4cCI6MjA2OTk2MjY1M30.o8nS9sg06fAaR8wDD8BSZFErDXbRvKlJtTW1ykRBqhU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
