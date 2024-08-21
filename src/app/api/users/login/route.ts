import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import jwt from 'jsonwebtoken';
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {

    try {
        await connect();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password must provided!" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) return NextResponse.json({ success: false, message: "Invalid credentials!" }, { status: 401 });

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) return NextResponse.json({ success: false, message: "Invalid credentials were provided!" }, { status: 401 });

        const token = jwt.sign(
            {
                id: user._id,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const response = NextResponse.json({ success: true, message: "Login successful" })

        response.cookies.set('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
            maxAge: 60 * 60, // 1 hour in seconds
            path: '/', // Cookie is accessible to the entire site
            sameSite: 'strict', // Protects against CSRF attacks
        });

        return response;

    } catch (error:any) {
        console.error("login failed Error: ",error.message);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }


}