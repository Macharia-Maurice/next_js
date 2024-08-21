import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup';

    const token = request.cookies.get('token')?.value || '';

    // If the user is authenticated and trying to access a public path, redirect to home
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // If the user is not authenticated and trying to access a protected path, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Allow the request to proceed if it passes the checks
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/profile/:id*',
        '/login',
        '/signup',
        '/logout',
    ],
};
