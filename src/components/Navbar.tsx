'use client';


import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from 'next-auth'
import { Button } from "./ui/button";


const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user as User


    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#">Mystrey Message...</a>
                {
                    session ? (<>
                        <span className="mr-4">Welcome,{user?.username || user?.email}</span>
                        <Button className="w-full md:w-auto " onClick={()=>signOut()}>Log out </Button>
                    </>
                    ) : (<>
                        <Link href="/sign-in"><Button className="w-full md:w-auto">Sign in</Button>  </Link>
                        <Link href="/sign-up"><Button className="w-full md:w-auto">Sign up</Button>  </Link>
                    </>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar;