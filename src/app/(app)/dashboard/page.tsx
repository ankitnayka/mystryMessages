'use client';

import message from "@/app/u/[username]/page";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {User} from 'next-auth'
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";

const dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);


    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })


    const { register, watch, setValue } = form;

    const acceptMessage = watch('acceptMessage');

    const fetchAccpetMessage = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const response = await axios.get(`/api/accept-message`);
            setValue('acceptMessage', response?.data?.isAcceptingMessages)
        } catch (error) {
            console.log("Error occur during switchong button......");
            toast.error('Error during switching for accept message')
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])


    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get('/api/get-messages');
            setMessages(response?.data?.messages)

            if (refresh) {
                toast.success(' Refresh  latest messages ...')
            }
        } catch (error) {
            console.log("error to fetching messages", error)
        } finally {
            setIsLoading(true);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setMessages])


    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAccpetMessage();
    }, [session, setValue, fetchMessages, fetchAccpetMessage])


    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accept-message', {
                acceptMessages: !acceptMessage
            })
            setValue('acceptMessage', !acceptMessage);
            toast.success(response?.data?.message || "change accept message switch")
        } catch (error) {
            console.log("Error in Handle switch-change ", error)
        }
    }


    const user:User=session?.user as User;

    const baseUrl=`${window.location.protocol}//${window.location.host}`;

    const profileUrl=`${baseUrl}//u/${user.username}`

    const copyToClipboard=()=>{
        navigator.clipboard.writeText(profileUrl);
        toast.success("Copy ProfileUrl suceessfull!!")
    }

    if(!session || !session.user){
        return <div>Please log in !!!</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
                <h1 className="text-4xl font-bold mb-4 ">User Dashboard</h1>
                <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">copy your Unique Link</h2>{' '}
                        <div className="flex items-center">
                                <input 
                                    type="text"
                                    value={profileUrl}
                                    disabled
                                    className="input input-bordered w-full p-2 mr-2"
                                />
                                <Button onClick={copyToClipboard}>Copy</Button>
                        </div>
                </div>
                <div className="mb-4">
                    <Switch
                        {...register('acceptMessage')}
                        checked={acceptMessage}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-2">
                        Accept Message : {acceptMessage?'On':"Off"}
                    </span>
                </div>
                <Separator />
                <Button
                className="mt-4"
                variant="outline"
                onClick={(e)=>{
                    e.preventDefault();
                    fetchMessages(true)
                }}
                >
                    {
                        isLoading ? (
                            <span>Loading...</span>
                        ):(
                            <span>Refresh....</span>
                        )
                    }
                </Button>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {
                            messages.length > 0 ? (
                                    messages.map(({message,index}:any)=>(
                                        <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
                                    ))
                            ) : null
                        }
                </div>

        </div>
    )
}

export default dashboard;