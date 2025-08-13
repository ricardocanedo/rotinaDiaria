// Import the Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize the Supabase client with your project's URL and anon key
const supabaseUrl = 'https://ojkrrizintbwiigagqny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qa3JyaXppbnRid2lpZ2FncW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDAyNTcsImV4cCI6MjA3MDY3NjI1N30.8S_dI1G8qh9bVeT3lvIrGPF-KIP3zqqrCBDjxvzTRcI';

export const supabase = createClient(supabaseUrl, supabaseKey);

