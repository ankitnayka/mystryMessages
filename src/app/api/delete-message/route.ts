import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(request: Request) {
    await dbConnect();

    try {
        const { messageId, userId } = await request.json();

        if (!messageId || !userId) {
            return Response.json({
                success: false,
                message: "Missing messageId or userId",
            }, { status: 400 });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        
        user.messages = user.messages.filter((msg: any) => msg._id.toString() !== messageId);
        await user.save();

        return Response.json({
            success: true,
            message: "Message deleted successfully",
        }, { status: 200 });

    } catch (error) {
        console.log("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Server error while deleting message",
        }, { status: 500 });
    }
}
