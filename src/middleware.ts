import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Frontend route protection
    if (path.startsWith('/api')) {
        return handleApiRoutes(request);
    } else {
        return handleFrontendRoutes(request);
    }
}

function handleFrontendRoutes(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/signup';

    const token = request.cookies.get('token')?.value || '';

    // Redirect authenticated users away from public paths
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Redirect unauthenticated users trying to access protected paths
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

async function handleApiRoutes(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public API paths that do not require authentication
    const publicPaths = ['/api/users/login', '/api/users/signup'];

    // Allow requests to public API paths without authentication
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Check for JWT in cookies
    const token = request.cookies.get('token')?.value || '';
    if (!token) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify JWT using 'jose'
        const encoder = new TextEncoder();
        const jwtSecret = encoder.encode(JWT_SECRET);
        const { payload }: any = await jwtVerify(token, jwtSecret);

        // Add user ID to headers if token is valid
        const response = NextResponse.next();
        response.headers.set('X-User-ID', payload.id);
        return response;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
}


export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/logout',
        '/profile',
        '/profile/:path*',
        '/api/:path*',
    ],
};
