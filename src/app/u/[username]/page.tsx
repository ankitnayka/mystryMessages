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
import { useParams } from "next/navigation"

const PublicMessage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const params=useParams()
    console.log("Params properties:",params?.username)
   
    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        }
    })
    const onSubmit = async (data: { content: string }) => {

        setIsLoading(true)
        if (!params?.username ) {
            console.error("User is not valid.....");
            return;
        }
        const payload = {
            content: data.content,
            username: params?.username,
        };
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', payload)

            toast.success(response?.data?.message || "Message added..")
        } catch (error: any) {
            toast.success(error?.response?.data.message)
            console.log("Error..try again",error)
        } finally {

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
                                    <FormLabel className="underline text-red-900">Write Message </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Minimum 10 character required..." {...field}
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
            <div className="grid grid-cols-1 md:grid-cols-3 ">
                            {

                            }
            </div>
        </div>
    )
}

export default PublicMessage;
