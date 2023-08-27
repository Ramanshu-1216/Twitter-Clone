"use client"
import React, { useEffect, useState } from 'react'
import PostItem from './PostItem';
import useAuthStore from '@/app/hooks/AuthStore';
import { toast } from 'react-hot-toast';
import useLoginModal from '@/app/hooks/LoginModalStore';
import useFeedStore from '@/app/hooks/FeedStore';

interface PostFeedProps {
    userId?: string,
}

const PostFeed: React.FC<PostFeedProps> = ({userId}) => {
    const useAuth = useAuthStore();
    const useFeed = useFeedStore();
    const loginModal = useLoginModal();
    
    useEffect(() => {
        if(!useAuth.user && useAuth.token){
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


    const [posts, setPosts] = useState<Array<any> | null>([]);
    useEffect(() => {
        if(!useFeed.posts){
            console.log("dasdsad")
            if(useAuth.token){
                console.log(useAuth.token);
                fetch('http://localhost:8000/auth/user/timeline', {
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
                        console.log(data.error);
                    }
                    else{
                        useFeed.setPost(data);
                    }
                })
                .catch((error) => {
                    
                    toast.error('Something went wrong!');
                    console.log(error);
                })
            }
            else{
                loginModal.onOpen();
            }
        }
    }, [useAuth.token, useFeed]);

    useEffect(() => {
        if(useFeed.posts){
            setPosts(useFeed.posts);
        }        
    }, [useFeed]);
    return (
        <div>
            {posts && posts.length > 0? posts.map((post: Record<string, any>) => (
                <PostItem userId={userId} key={post._id} data={post} />
            )): <p className='text-neutral-400 text-center p-2 mt-10'>No feed yet, follow users to get it.</p>}
        </div>
    )
}

export default PostFeed