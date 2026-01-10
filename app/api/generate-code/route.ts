import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Ensure we have the service role key for write access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { planName, email } = await request.json();

        if (!planName) {
            return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
        }

        // 1. Generate Unique Code
        // Format: PLAN-XXXXX (e.g., STARTER-A1B2C)
        const prefix = planName.toUpperCase().substring(0, 4);
        const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
        const code = `${prefix}-${randomString}`;

        // 2. Calculate Expiry
        const now = new Date();
        let daysToAdd = 7; // Default/Starter

        if (planName.toLowerCase().includes('popular')) daysToAdd = 30;
        if (planName.toLowerCase().includes('coach')) daysToAdd = 90;

        const expiresAt = new Date(now.setDate(now.getDate() + daysToAdd));

        // 3. Insert into Supabase
        const { error: dbError } = await supabase
            .from('access_codes')
            .insert({
                code: code,
                is_active: true,
                assigned_to: email || null,
                expires_at: expiresAt.toISOString()
            });

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
        }

        // 4. Send Email Logic (Placeholder)
        // TODO: Send email to user with code
        console.log(`[MOCK EMAIL] Sending code ${code} to ${email || 'user'}. Expires: ${expiresAt.toISOString()}`);

        return NextResponse.json({
            success: true,
            code: code,
            expiresAt: expiresAt.toISOString(),
            message: 'Code generated and sent to email'
        });

    } catch (err: any) {
        console.error('Generation Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
