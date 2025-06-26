import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(req: NextRequest) {
    // For simplicity, we'll handle auth checks on the client side
    // This middleware mainly handles redirects for auth pages

    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register') ||
        req.nextUrl.pathname.startsWith('/reset-password')

    const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding')
    const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback')
    const isPublicPage = req.nextUrl.pathname === '/' ||
        req.nextUrl.pathname.startsWith('/about') ||
        req.nextUrl.pathname.startsWith('/contact') ||
        req.nextUrl.pathname.startsWith('/faq') ||
        req.nextUrl.pathname.startsWith('/terms') ||
        req.nextUrl.pathname.startsWith('/privacy') ||
        req.nextUrl.pathname.startsWith('/artists') ||
        req.nextUrl.pathname.startsWith('/genre') ||
        req.nextUrl.pathname.startsWith('/popular') ||
        req.nextUrl.pathname.startsWith('/chord')

    // Allow all requests to pass through
    // Auth checking will be handled on the client side
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
