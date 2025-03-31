import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { request } from "http";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // console.log("Server",user)
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'no session and user found !!!'
        },{status:400})
    }

    const userId=new mongoose.Types.ObjectId(user?._id);
    // console.log("UserId",userId)
    try {
            const user=await UserModel.aggregate([
                {$match:{_id:userId}},
                {$unwind:'$messages'},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'_$id',messages:{$push:'$messages'}}}
            ])
            // console.log("new user",user);
            

            if(!user || user.length===0){
                return Response.json({
                    success:false,
                    message:"Not authorization"
                },{status:401})
            }

            return Response.json({
                success:true,
                messages:user[0].messages
            },{status:201})
    } catch (error) {
        console.log("Error on server side get messages")
        return Response.json({
            success:false,
            message:'Error on server side get messages'
        },{status:500})
    }
}