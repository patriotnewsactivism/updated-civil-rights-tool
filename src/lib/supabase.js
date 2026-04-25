import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vrdnrbjnitptxrexdlao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZG5yYmpuaXRwdHhyZXhkbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzU2MjUsImV4cCI6MjA4MzExMTYyNX0.ve-Ye_ZxWRmeAB4p3YMvl2zoOkmOV65m2YWcwhXStHY';

export const supabase = createClient(supabaseUrl, supabaseKey);

