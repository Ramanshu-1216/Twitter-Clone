"use client"
import useAuthStore from '@/app/hooks/AuthStore'
import useFeedStore from '@/app/hooks/FeedStore'
import { formatDistanceToNowStrict } from 'date-fns'
import { tr } from 'date-fns/locale'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AiFillDelete, AiFillHeart, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'
interface PostItemProps {
    userId?: string,
    data: Record<string, any>,
    showDelete: boolean
}
const PostItem: React.FC<PostItemProps> = ({ userId, data,showDelete }) => {
    const [like, setLike] = useState(false);
    const useFeed = useFeedStore();
    const useAuth = useAuthStore();
    const [deleteTweet, setDeleteTweet] = useState(false);
    const goToPost = () => {

    }

    const goToUser = () => {

    }

    const deletePost = async (id: string) => {
        await fetch('http://localhost:8000/auth/user/deleteTweet', {
            method: 'DELETE',
            headers: {
                'Authorization': 'bearer ' + useAuth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tweetId: id})
        })
        .then((response) => response.json())
        .then((data) => {
            setDeleteTweet(true);
            toast.success('Deleted');
        })
    }
    
    const toggleLike = async () => {
        if(useAuth.token){
            await fetch('http://localhost:8000/auth/user/tweet/like', {
                method: 'POST',
                headers: {
                    'Authorization': 'bearer ' + useAuth.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tweetId: data._id})
            });
            if(!like){
                if(!data.likes.includes(useAuth.user._id)){
                    data.likes.push(useAuth.user._id);
                }
            }
            else{
                console.log(data.likes.length);
                data.likes = data.likes.filter((id) => id != useAuth.user._id);
                console.log(data.likes.length);
            }
            setLike(!like);
            console.log(useAuth.token);
        }
    }

    useEffect(() => {
        if(useAuth.token){
            if(data.likes.includes(useAuth.user?._id)){
                setLike(true);
            }
            else{
                setLike(false);
            }
        }
    }, [data.likes]);

    const createdAt = useMemo(() => {
        if(!data?.created_at){
            return null;
        }
        let created_at =  formatDistanceToNowStrict(new Date(data.created_at));
        created_at = String(created_at);
        created_at = created_at.split(' ');
        created_at = created_at[0] + created_at[1].substring(0, 1);
        return created_at;
    }, [data, useFeedStore()]);
    if(deleteTweet) return null;
    return (
        <div onClick={goToPost} className='border-b-[1px] border-neutral-800 p-6 cursor-pointer hover:bg-neutral-900 transition'>
            <div className='flex flex-row items-start gap-3 flex-1'>
                <div className='items-center mt-1'>
                    <FaUser  size={20} color='white' />
                </div>
                <div className='flex-1'>
                    <div className='flex flex-row items-center gap-2 flex-1'>
                        <p onClick={goToUser} className='text-white font-semibold cursor-pointer hover:underline'>{data.user.name}</p>
                        <span onClick={goToUser} className='text-neutral-500 cursor-pointer hover:underline'>@{data.user.username}</span>
                        <span className='text-neutral-500 text-sm flex-grow'> · {createdAt}</span>
                        {showDelete && (
                        <div className='flex flex-row items-center mt-1'>
                        <div className='items-end right-2 hover:bg-black -mt-3 p-2 rounded-full'  >
                            <AiOutlineEdit size={24} color='white' />
                        </div>
                        <div className='items-end hover:bg-black -mt-3 p-2 rounded-full'  onClick={() => {deletePost(data._id)}} >
                            <AiOutlineDelete size={24} color='white' />
                        </div>
                        </div>
                        )}
                    </div>
                    <div className='text-white mt-1'>{data.text}</div>
                    <div className='flex flex-row items-center mt-3 gap-10'>
                        <div className='flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500'>
                            <AiOutlineMessage size={20}/>
                            <p>{data.comments?.length || 0}</p>
                        </div>
                        <div className='flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500' onClick={() => {toggleLike()}}>
                            {like ? <AiFillHeart size={20} color='red' /> : <AiOutlineHeart size={20}/>}
                            <p>{data.likes?.length || 0}</p>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default PostItem