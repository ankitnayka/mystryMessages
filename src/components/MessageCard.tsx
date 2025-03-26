'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"


type MessageCardProps={
    message:Message;
    onMessageDelete:(messageId:string)=>void
}

const  MessageCard = ({message,onMessageDelete}:MessageCardProps) => {

    const handleDeleteMessage=async()=>{
        const response=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast.success(response.data.message || "Delete messag")
        toast.success("Delete messag")
        // onMessageDelete(message._id);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline"><span className="w-5 h-5">X</span></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                            onClick={handleDeleteMessage}
                            >Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
        </Card>

    )
}

export default MessageCard;