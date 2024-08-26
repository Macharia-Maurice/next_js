import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";


export async function POST(request: NextRequest) {
    try {
        await connect()

        const { token } = await request.json()

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        })

        if (!user) return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 400 })

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: "Account Verified" })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server Error" }, { status: 500 })

    }
}