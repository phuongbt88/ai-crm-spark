// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qrwxwxirouscsuznvtdr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3h3eGlyb3VzY3N1em52dGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTkwNjUsImV4cCI6MjA1OTMzNTA2NX0.ZOvO3ro0d38-jm6QZwItZ2g66MELCZGpm-yaUyQ0TUw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);