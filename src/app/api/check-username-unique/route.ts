import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "username is not valid ! try another username !!!"
            }, { status: 400 })
        }

        console.log("Zod validation Username", result);

        const { username } = result.data;

        const existingUser = await UserModel.findOne({ username, isVerified: true });

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is Unique"
        }, { status: 200 })


    } catch (error) {
        console.log("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}