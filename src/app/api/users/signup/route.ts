import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/UserModel';
import { validateEmail, validatePassword } from '@/utils/validators';
import { sendEmail } from '@/helpers/mailer';

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email, password, username } = await request.json();

        // Check if email and password are provided
        if (!email || !password || !username) {
            return NextResponse.json({ success: false, message: 'Email, username and password are required' }, { status: 400 });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
        }

        // Validate password strength
        // if (!validatePassword(password)) {
        //     return NextResponse.json({ success: false, message: 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character' }, { status: 400 });
        // }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        //send verification email
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id })

        return NextResponse.json({ success: true, message: 'User registered successfully', "user": newUser }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
