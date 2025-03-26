import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";



export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated....!"
        }, { status: 401 })
    }

    const userId = user?._id;

    const { acceptMessages } = await request.json();
    try {

        const updatedUser = await UserModel.findById(userId, { isAcceptingMessages: acceptMessages }, { new: true })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'Failed to upadte user status to accept message toggle'
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: 'Message status to accept message successfully !!',
            updatedUser
        }, { status: 200 })


    } catch (error) {
        console.log("Failed(Server) to upadte user status to accept message toggle")
        return Response.json({
            success: false,
            message: 'Failed(Server) to upadte user status to accept message toggle'
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated....!"
        }, { status: 401 })
    }

    const userId = user?._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: 'Failed to upadte user status to accept message toggle'
            }, { status: 500 })
        }


        return Response.json({
            success: true,
            isAcceptingMessages: foundUser?.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log('Error in geting message acceptance status');
        return Response.json({
            success: false,
            message: 'Error in geting message acceptance status'
        }, { status: 500 })
    }
}
