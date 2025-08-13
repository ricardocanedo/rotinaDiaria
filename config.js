// Supabase Configuration
let supabase = null;

try {
    // Only initialize Supabase if the URL and key are provided
    const supabaseUrl = 'https://ojkrrizintbwiigagqny.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qa3JyaXppbnRid2lpZ2FncW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDAyNTcsImV4cCI6MjA3MDY3NjI1N30.8S_dI1G8qh9bVeT3lvIrGPF-KIP3zqqrCBDjxvzTRcI';

    if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
        SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
    } else {
        console.warn('Supabase credentials not configured. Using local storage only.');
    }
} catch (error) {
    console.error('Error initializing Supabase:', error);
    console.warn('Falling back to local storage');
}

export { supabase };