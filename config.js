// Supabase Configuration
let supabase = null;

try {
    // Only initialize Supabase if the URL and key are provided
    const SUPABASE_URL = 'https://zfqkqtvhnqbeyykgfgky.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcWtxdHZobnFiZXl5a2dmZ2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODY2NTMsImV4cCI6MjA2OTk2MjY1M30.o8nS9sg06fAaR8wDD8BSZFErDXbRvKlJtTW1ykRBqhU';
    
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
