import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, code } = await request.json();
    console.log(username,code);
    try {
        const decodedUsername = decodeURIComponent(username);
        
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log(user);
        
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found!",
                }),
                { status: 404 }
            );
        }

        if (!user.verifyCode || !user.verifiedCodeExpiry) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification code not found or expired!",
                }),
                { status: 400 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifiedCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Account Verified Successfully!",
                }),
                { status: 200 }
            );
        }

        if (!isCodeNotExpired) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification code expired. Please sign up again to get a new code.",
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                success: false,
                message: "Invalid verification code!",
            }),
            { status: 400 }
        );

    } catch (error) {
        console.error("Error verifying code:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error",
            }),
            { status: 500 }
        );
    }
}
