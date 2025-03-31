'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue ,useDebounceCallback} from 'usehooks-ts'
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


const SignUp = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {

    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data?.message)
        } catch (error) {
          console.log("Error on check username available!!");
          toast.error("no ")
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username...."
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();

  }, [username])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success(response?.data?.message || "code send please verify ");

      router.replace(`/verify/${username}`);


    } catch (error) {
      console.log("Error occur on sign up  !!", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg0gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-mf">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight
                   lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4">Sign up to start your anonymous adventure....</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="enter username" {...field}
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                    />
                    
                  </FormControl>
             
                  <FormMessage />
                </FormItem>
              )}
            />
                 {
              isCheckingUsername && (<>
                please wait while username checking...
              </>)
            }
           <p className={`text-sm ${usernameMessage ==="usernameMessage" ? 'text-red-500':'text-green-500'}`}>{usernameMessage}</p>
            <FormField
              control={form.control}
              name="email"
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
              {isSubmiting ?"please wait....":"sign up "}
            </Button>
          </form>
        </Form>

      </div>
    </div>
  )
}

export default SignUp;