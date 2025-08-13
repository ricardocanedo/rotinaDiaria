// Import the Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize the Supabase client with your project's URL and anon key
const supabaseUrl = 'https://ckktgeivwuiulbbgorip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNra3RnZWl2d3VpdWxiYmdvcmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODY2ODYsImV4cCI6MjA3MDY2MjY4Nn0.u3tIkPIr50bfoCnQ4T8Sz2FPbIInotiB-yjpB-4gW6E';

export const supabase = createClient(supabaseUrl, supabaseKey);

