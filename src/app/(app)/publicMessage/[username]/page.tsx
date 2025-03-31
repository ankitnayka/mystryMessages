'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useSession } from "next-auth/react"
import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import { useState } from "react"

const PublicMessage = () => {

    const [isLoading,setIsLoading]=useState(false)



    const { data: session } = useSession();
    
    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        }
    })


   

    const onSubmit=async(data:{content:string})=>{

        setIsLoading(true)
        if (!session || !session.user) {
            console.error("User is not logged in!");
            return;
        }
        const payload = {
            content: data.content,
            username: session.user.username, 
        };
            try {
                const response=await axios.post<ApiResponse>('/api/send-message',payload)
                console.log(response)
                toast.success(response?.data?.message || "Message added.." )
            } catch (error:any) {
                toast.success(error?.response?.data.message)
                // console.log("Message not send..try again..",error)
                
            }finally{
                
            }
           
    }   


    return (
        <div className="flex  justify-center flex-col">
            <h1 className="text-4xl font-bold text-center my-8">Public Message Page....</h1>

            <div className="flex justify-center   p-4 w-full max-w-lg mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="enter Email" {...field}
                                        />

                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="ml-2">
                    Send
                </Button>
                    </form>
                </Form>
                
            </div>
        </div>
    )
}

export default PublicMessage;
