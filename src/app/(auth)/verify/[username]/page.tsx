'use client';

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const verifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>()

    const form = useForm({
        resolver: zodResolver(verifySchema),

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success('verify successfuly !!!')

            router.replace('/sign-in')

        } catch (error) {
            console.log("Error occur during verification", error);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg0gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-mf">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight
                   lg:text-5xl mb-6">Verify Account .....</h1>
                    {/* <p className="mb-4">Sign up to start your anonymous adventure....</p> */}
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification code </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter verification Code" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            ..................
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default verifyAccount;