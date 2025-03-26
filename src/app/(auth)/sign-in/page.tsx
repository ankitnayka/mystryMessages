'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { signIn } from "next-auth/react";


const SignIn = () => {

    const [isSubmiting, setIsSubmitting] = useState(false);

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })




    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        console.log(data.identifier)
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        console.log(result)
        if (result?.error) {
            toast.error("Log in fail....");
        }
        if (result?.url) {
            router.replace('/dashboard')
        }
        setIsSubmitting(false);
        

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg0gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-mf">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight
                   lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-4">Sign in  to start your anonymous adventure....</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="identifier"
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password"
                                            placeholder="enter password" {...field}
                                        />

                                    </FormControl>
                                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmiting}>
                            {isSubmiting ? "please wait...." : "sign up "}
                        </Button>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default SignIn;