import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and API Key
const SUPABASE_URL = "https://qopdjgfciakmvhlriixt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
