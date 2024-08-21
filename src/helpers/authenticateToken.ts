import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';

        if (!token) return NextResponse.json({ success: false, message: "No token found" }, { status: 401 });

        const decodedToken:any = jwt.verify(token, JWT_SECRET);

        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message)
    }
}