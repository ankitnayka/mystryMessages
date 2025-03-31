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


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete,_id }: any) => {

    

    return (
        <Card>
            <CardHeader>
                <div className="w-full justify-between flex">
                    <CardTitle>{message}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-600" variant="outline"><span className="w-5 h-5 ">X</span></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are sure for Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                    its peramnetly delete the Message 
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={()=>onMessageDelete(_id)}
                                >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
        </Card>

    )
}

export default MessageCard;