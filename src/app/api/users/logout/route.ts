import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({ success: true, message: "logged out successfully" })
        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;

    } catch (error: any) {
        console.error(error)

        return NextResponse.json({ success: false, message: "internal server error" }, { status: 500 });
    }
}