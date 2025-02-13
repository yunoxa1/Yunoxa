import dotenv from 'dotenv'; // Load environment variables
import { createClient } from '@supabase/supabase-js';

dotenv.config(); // Load variables from .env

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE // Using Service Role Key securely
);

export default supabase;
