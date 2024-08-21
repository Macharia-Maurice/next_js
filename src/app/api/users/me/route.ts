import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import { connect } from "@/dbConfig/dbConfig";
import { authenticateToken } from "@/helpers/authenticateToken";

export async function GET(request: NextRequest) {
    try {
        await connect();

        const userId = await authenticateToken(request); // authenticate user

        const user = await User.findOne({ _id: userId }).
            select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "user found", user });



    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }

}