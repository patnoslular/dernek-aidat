import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nfzdgdotqveuhiercphf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5memRnZG90cXZldWhpZXJjcGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDcwMDQsImV4cCI6MjA4NzYyMzAwNH0.yqLhHiJ2QkxPUhk3caoS7sXSFBJ9rwtJSo3ZHPbLUV0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
