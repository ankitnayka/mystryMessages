import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//request:Request-its datatype
export async function POST(request: Request) {
    await dbConnect()
    try {
         const { username, email, password } = await request.json()

         const existingUserVerifiedByUsername=await UserModel.findOne({username,isVerified:true});
         if(!username || !email || !password){
            return Response.json({
                success:false,
                message:"All Field Required"
            },{
                status:400
            })
         }

         if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"User is already taken"
            },{status:400})
         }

         const existingUserByEmail=await UserModel.findOne({email})

         const verifyCode=Math.floor(10000+Math.random()*90000).toString()
         if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return Response.json({
                        success:false,
                        message:"User already exist "
                    },{
                        status:400
                    })
                }else{
                    const hashPassword=await bcrypt.hash(password,10);
                    existingUserByEmail.password=hashPassword;
                    existingUserByEmail.verifyCode=verifyCode;
                    existingUserByEmail.verifiedCodeExpiry=new Date(Date.now()+3600000)
                    await existingUserByEmail.save()
                }


         }else{
            const hashPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

          const newUser=  new UserModel({
                 username,
                    email,
                    password:hashPassword,
                    verifyCode:verifyCode,
                    verifiedCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessages:true,
                    messages:[]
            })

            await newUser.save()
         }

            //send verification email

            const emailResponse=await sendVerificationEmail(email,username,verifyCode)

            if(!emailResponse.success){
                return Response.json({
                    success:false,
                    message:emailResponse.message,
                },{status:500})
            }


            return Response.json({
                success:true,
                message:"User Register Successfully ,please verify your email",
            },{status:200})


    } catch (error:any) {
        console.log('Error registering user', error)
        return Response.json({
            success: false,
            message: "error registering user",
        }, {
            status: 500
        })
    }
}