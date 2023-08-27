"use client"
import Header from '@/app/component/Header'
import UserPage from '@/app/component/User/UserPage'
import useAuthStore from '@/app/hooks/AuthStore'
import { error } from 'console'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const User = ({params}) => {
    const useAuth = useAuthStore();
    const [user, setUser] = useState();
    useEffect(() => {
        if(useAuth.token){
            fetch('http://localhost:8000/auth/user', {
                method: 'POST',
                headers: {
                    'Authorization': 'bearer ' + useAuth.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: params.user})
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.error){
                    console.log(data);
                    toast.error('Something went wrong!');
                }
                else{
                    setUser(data.user);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Something went wrong!');
            })
        } 
    }, [useAuth]);
    if(!user) return null;
    return (
        <div>
            <Header showBackArrow label={user?.name} />
            <UserPage user={user}/>
        </div>
    )
} 

export default User