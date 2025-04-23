import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsmuaszmgoalenolgzyb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbXVhc3ptZ29hbGVub2xnenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTQxMDIsImV4cCI6MjA2MDIzMDEwMn0.JENnfBnBKwn-7oPTjcyRiDfjtn0JIW69Pfm1JD4_Uf0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
