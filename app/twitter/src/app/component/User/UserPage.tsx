import useAuthStore from '@/app/hooks/AuthStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import Button from '../Button';
import { format } from 'date-fns';
import { BiCalendar } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { error } from 'console';
import { el } from 'date-fns/locale';
import PostItem from '../Post/PostItem';

interface UserPageProps {
    user: Object
}

const UserPage: React.FC<UserPageProps> = ({user}) => {
    const useAuth = useAuthStore();
    const [tweets, setTweets] = useState([]);
    if(!user) return null;
    const created_at = () => {
        console.log("");
        if(!user.created_at){
            return null;
        }
        return format(new Date(user.created_at), 'MMMM yyyy');
    };

    useEffect(() => {
        if(useAuth.user){
            fetch('http://localhost:8000/auth/user/myTweets', {
                method: 'POST',
                headers: {
                    'Authorization': 'bearer ' + useAuth.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: user._id})
            })
            .then(((response) => response.json()))
            .then((data) => {
                if(data.error){
                    toast.error('Something went wrong!');
                    console.log(data);
                }
                else{
                    console.log(data);
                    setTweets(data);
                }
            })
            .catch((error) => {
                toast.error('Something went wrong!');
                console.log(error);
            })
        }
        else{
            fetch('http://localhost:8000/auth/user', {
                method: 'GET',
                headers: {
                    'Authorization': 'bearer ' + useAuth.token,
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.error){
                    toast.error('Something went wrong!');
                }
                else{
                    useAuth.setUser(data.user); 
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Something went wrong!');
            })
        }
    }, [useAuth]);

    return (
        <div>
            <div className='bg-neutral-700 h-44 relative'>
                <div className='absolute -bottom-11 left-4'>
                    <div className='bg-neutral-500 p-7 rounded-full border-[2px] border-black'>
                        <FaUser size={50} color='white'  />
                    </div>
                </div>
            </div>
            <div className='border-b-[1px] border-neutral-800 pb-4'>
                <div className='flex justify-end p-2'>
                    {useAuth.user?._id === user._id ? (
                        <Button secondary label='Edit' onClick={() => {}} />
                    ): (
                        <Button onClick={() => {}} label='Follow' secondary />
                    )}
                </div>
                <div className='mt-8 px-4'>
                    <div className='flex flex-col'>
                        <p className='text-white text-2xl font-semibold'>
                            {user.name}
                        </p>
                        <p className='text-md text-neutral-500'>
                            @{user.username}
                        </p>
                    </div>
                    <p className='text-white'>
                        {user.bio}
                    </p>
                    <div className='flex flex-row items-center gap-2 mt-4 text-neutral-500'>
                        <BiCalendar size={24} />
                        <p>Joined {created_at()}</p>
                    </div>
                </div>
                <div className='flex flex-row items-center mt-4 gap-6 px-4'>
                    <div className='flex flex-row items-center gap-1'>
                        <p className='text-white'>
                            {user.following?.length}
                        </p>
                        <p className='text-neutral-500'>
                            Following
                        </p>
                    </div>
                    <div className='flex flex-row items-center gap-1'>
                        <p className='text-white'>
                            {user.followers?.length}
                        </p>
                        <p className='text-neutral-500'>
                            Followers
                        </p>
                    </div>
                </div>
            </div>
            <div>
            {tweets && tweets.length > 0? tweets.map((post: Record<string, any>) => (
                <PostItem showDelete key={post._id} data={post} />
            )): <p className='text-neutral-400 text-center p-2 mt-10'>No tweets yet.</p>}
            </div>
        </div>
    )
}

export default UserPage