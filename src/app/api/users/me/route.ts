import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        // Extract userId from headers set by the middleware
        const userId = request.headers.get('userId') || '';

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID not provided" }, { status: 400 });
        }

        await connect();

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User found", user });

    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
