// Supabase Configuration
let supabase = null;

try {
    // Only initialize Supabase if the URL and key are provided
    const SUPABASE_URL = 'https://ckktgeivwuiulbbgorip.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNra3RnZWl2d3VpdWxiYmdvcmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODY2ODYsImV4cCI6MjA3MDY2MjY4Nn0.u3tIkPIr50bfoCnQ4T8Sz2FPbIInotiB-yjpB-4gW6E';
    
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