import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import User from '@/models/UserModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //create a hashed token

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000,
                },
            )
        } else if (emailType = "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                },
            )

        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6785337e3dc857",
                pass: "b9446f11176581"
            }
        });

        const mailOptions = {
            from: 'mauricemaina669@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href ="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</P>}`
        }

        const mailResponse = await transport.sendMail(mailOptions);
        
        return mailResponse;

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}