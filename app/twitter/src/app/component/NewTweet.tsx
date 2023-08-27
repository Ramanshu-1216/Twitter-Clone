"use client"
import React, { useState } from 'react'
import Button from './Button'
import { FaUser } from 'react-icons/fa';
import useAuthStore from '../hooks/AuthStore';
import { toast } from 'react-hot-toast';
import useFeedStore from '../hooks/FeedStore';

function NewTweet() {
    const [isLoading, setIsLoading] = useState(false);
    const [body, setBody] = useState('');
    const [placeholder, setPlaceHolder] = useState("What's happening?!");
    const useAuth = useAuthStore();
    const useFeed = useFeedStore();
    const onSubmit = () => {
        setIsLoading(true);
        fetch('http://localhost:8000/auth/user/newTweet', {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + useAuth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: body})
        })
        .then((response) => response.json())
        .then((data) => {
            setIsLoading(false);
            if(data.error){
                console.log(data.error);
                toast.error('Something went wrong!');
            }
            else{
                setBody('');
                const posts = [data.post, ...useFeed.posts];
                // posts?.(data.post);
                useFeed.setPost(posts);
                toast.success('Posted!');
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error);
            toast.error('Something went wrong!');
        });
    }
    return (
        <div className='border-b-[1px] border-neutral-800 px-6 py-2'>
            <div className='py-6'>
            <div className='flex flex-col gap-1'>
                <div className='flex flex-row'>
                    <div className='mr-4'>
                        <FaUser size={25} color='white' />
                    </div>
                    <textarea disabled={isLoading} onChange={(e) => setBody(e.target.value)} value={body} className='disabled:opacity-80 peer resize-none w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white items-center' placeholder={placeholder} />
                </div>
                <hr className='opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition' />
                <div className='mt-2 flex flex-row justify-end'>
                <Button disabled={isLoading || !body} onClick={onSubmit} label='Tweet' />
                </div>
            </div>
            </div>
        </div>
    )
}

export default NewTweet