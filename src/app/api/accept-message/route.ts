import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not Authenticated....!" }),
            { status: 401 }
        );
    }

    const userId = session.user._id; 
    const { acceptMessages } = await request.json();

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { isAcceptingMessages: acceptMessages }, 
            { new: true } 
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({ success: false, message: "Failed to update user status" }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Message status updated successfully!", updatedUser }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating message status:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Server error updating message status" }),
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not Authenticated....!" }),
            { status: 401 }
        );
    }

    const userId = session.user._id; // Ensure `_id` exists in session

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, isAcceptingMessages: foundUser.isAcceptingMessages }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error getting message acceptance status:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error fetching message status" }),
            { status: 500 }
        );
    }
}
