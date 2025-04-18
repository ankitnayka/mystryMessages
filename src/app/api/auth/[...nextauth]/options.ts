import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }
                await dbConnect();
                console.log("userEmial", credentials.identifier)
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error('No user Found with this email');
                    }

                    if (!user.isVerified) {
                        throw new Error(' please  verified your account first !!');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {

                        throw new Error(' please  verified your account first !!');
                    }

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token?._id;
                session.user.isVerified = token?.isVerified;
                session.user.isAcceptingMessage = token?.isAcceptingMessage;
                session.user.username = token?.username;
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
                console.log("JWT Token Generated: ", token);
            }
            return token
        }
    },
    pages: {
        signIn: "/sign-in",
        error:"/sihn-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};


