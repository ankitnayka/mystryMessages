'use client';

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const handleDeleteMessage = async (messageId: string) => {
        if (!user || !user._id) return;

        try {
            const response = await axios.delete("/api/delete-message", {
                data: { messageId, userId: user._id },
            });

            if (response.data.success) {
                setMessages(messages.filter((message) => message._id !== messageId));
                toast.success("Message deleted successfully!");
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.log("Error deleting message:", error);
            toast.error("Failed to delete message");
        }
    };


    const { data: session } = useSession();
    const user: User = session?.user as User;

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessage = watch("acceptMessage");

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const response = await axios.get(`/api/accept-message`);
            setValue("acceptMessage", response?.data?.isAcceptingMessages);
            console.log("Testing...", response);
        } catch (error) {
            console.log("Error during switching button...");
            toast.error("Error during switching for accept message");
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get("/api/get-messages");
            setMessages(response?.data?.messages);

            if (refresh) {
                toast.success("Refreshed latest messages...");
            }
        } catch (error) {
            console.log("Error fetching messages", error);
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, []);
    console.log(messages);

    useEffect(() => {
        if (!session || !session?.user) return;
        fetchAcceptMessage();
        fetchMessages();
    }, [session, setValue, fetchAcceptMessage]);

    const handleSwitchChange = async () => {
        const newAcceptMessageState = !acceptMessage;
        setValue("acceptMessage", newAcceptMessageState);

        try {
            const response = await axios.post("/api/accept-message", {
                acceptMessages: newAcceptMessageState,
            });

            if (response?.data?.success) {
                toast.success(response?.data?.message || "Changed accept message switch");
            } else {
                throw new Error("Server did not confirm update");
            }
        } catch (error) {
            console.log("Error in Handle switch-change", error);

            // Revert UI state if request fails
            setValue("acceptMessage", acceptMessage);
            toast.error("Failed to update accept message status.");
        }
    };

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${user?.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Copied Profile URL successfully!");
    };

    if (!session || !session.user) {
        return <div>Please log in!!!</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy your Unique Link</h2>
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
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? "On" : "Off"}
                </span>
            </div>
            <Separator />
            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? <span>Loading...</span> : <span>Refresh</span>}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map(({ content, _id }: any) => (
                        <MessageCard
                            key={_id}
                            message={content}
                            _id={_id}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages available.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
