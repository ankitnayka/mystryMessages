import { resend } from "../lib/resend";
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from "@/types/apiResponse";



export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code by ankit',
            react: VerificationEmail({username,otp:verifyCode})
          });
        return{success:true,message:"verifiaction email send successfully"}
    } catch (emailError) {
        console.error("Error sending erification email",emailError)
        return{success:false,message:"faild to send verifiaction email"}
    }
}