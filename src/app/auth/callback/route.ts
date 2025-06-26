import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if user has completed onboarding
            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', data.user.id)
                .single();

            let redirectUrl = next;

            if (!profile?.onboarding_completed) {
                // Create initial profile if it doesn't exist
                await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        full_name: data.user.user_metadata?.full_name || '',
                        email: data.user.email || '',
                        onboarding_completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                redirectUrl = '/onboarding';
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
