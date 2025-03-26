import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                message: 'username not found',
                success: false
            },{status:404})
        }

        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User not accepting messages !!!"
            })
        }

        const newMessage={content,createdAt:new Date()};
        user.messages.push(newMessage as Message)

        await  user.save()

        return Response.json({
            success:true,
            message:'message added successfully!!'
        },{status:201})

    } catch (error) {
        console.log("server error on message",error)
        return Response.json({
            message: 'Error on srver side',
            success: false
        })
    }
}