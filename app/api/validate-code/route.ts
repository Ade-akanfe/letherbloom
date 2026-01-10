import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for secure server-side validation
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('access_codes')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .maybeSingle();

        console.log(error);

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid or inactive code' }, { status: 401 });
        }

        const now = new Date().toISOString();
        if (data.expires_at && data.expires_at <= now) {
            return NextResponse.json({ error: 'Code expired' }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: 'Code validated' });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
