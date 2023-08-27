"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import Button from '../component/Button';
import { FaUser } from 'react-icons/fa';
import Header from '../component/Header';
import useUsersStore from '../hooks/UsersStore';
import useAuthStore from '../hooks/AuthStore';
import { toast } from 'react-hot-toast';
import { error } from 'console';
import useLoginModal from '../hooks/LoginModalStore';

const Explore = () => {
    const [users, setUsers] = useState([{}]);
    const [following, setFollowing] = useState<Array<any> | null>();
    const [notFollowing, setNotFollowing] = useState<Array<any> | null>();
    const useusers = useUsersStore();
    const useAuth = useAuthStore();
    const loginModal = useLoginModal();
    useEffect(() => {
        if(useAuth.token){
            fetch('http://localhost:8000/auth/user/all', {
                method: 'GET',
                headers: {
                    'Authorization': 'bearer ' + useAuth.token
                }
            })
            .then((response) => 
                response.json()
            )
            .then((data) => {
                console.log(data);
                if(data.error){
                    toast.error('Something went wrong');
                }
                else{
                    useusers.setFollowingUsers(data.following);
                    useusers.setNotFollowingUsers(data.notFollowing);
                    useAuth.setUser(data.user);
                }
            })
            .catch((error) => {
                toast.error('Something went wrong');
            });
        }
        else{
            loginModal.onOpen();
        }
    }, [useAuth.token]);

    useEffect(() => {
        setFollowing(useusers.usersFollowing);
        setNotFollowing(useusers.usersNotFollowing);
    }, [useusers]);

    const handleFollow = (user : Object) => {
        fetch('http://localhost:8000/auth/user/follow', {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + useAuth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: user._id})
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.error){
                toast.error('Something went wrong');
                console.log(data);
            }
            else{
                toast.success('Followed');
                const newFollowing = following;
                newFollowing?.push(user);
                useusers.setFollowingUsers(newFollowing);
                const newNotFollowing = notFollowing?.filter((u) => u._id !== user._id);
                useusers.setNotFollowingUsers(newNotFollowing);
            }
        })
        .catch((error) => {
            console.log(error);
            toast.error('Something went wrong');
        })
    }

    const handleUnfollow = (user : Object) => {
        console.log(user._id)
        fetch('http://localhost:8000/auth/user/unfollow', {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + useAuth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: user._id})
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.error){
                toast.error('Something went wrong');
                console.log(data);
            }
            else{
                toast.success('Unollowed');
                const newFollowing = following?.filter((u) => u._id !== user._id);
                useusers.setFollowingUsers(newFollowing);
                const newNotFollowing = notFollowing;
                newNotFollowing?.push(user);
                useusers.setNotFollowingUsers(newNotFollowing);
            }
        })
        .catch((error) => {
            console.log(error);
            toast.error('Something went wrong');
        })
    }

  return (
    <div>
        <Header label='Explore' />
        <div className='flex flex-col gap-6 p-10'>
            <p className='text-white font-bold text-xl'>Who to follow</p>
            {notFollowing && notFollowing?.length > 0 ? notFollowing.map((user: Record<string, any>) => (
                <div className='flex flex-row gap-4 border-b-[1px] border-neutral-800 pb-6 items-center' key={user.id}>
                    <FaUser size={20} color='white'/>
                    <div className='flex flex-col flex-1'>
                        <p className='text-white font-semibold text-xl'>{user.name}</p>
                        <p className='text-neutral-400 text-m'>@{user.username}</p>
                    </div>
                    <Button label='Follow' large={false} onClick={() => {handleFollow(user)}} secondary key={user.id}/>
                </div>
            )): 
            <p className='text-neutral-400'>Noboody to follow more!</p>}
        </div>
        <hr className='bg-neutral-800 opacity-40'/>
        <div className='flex flex-col gap-6 p-10'>
            <p className='text-white font-bold text-xl'>You follows</p>
            {following && following.length > 0 ? following.map((user: Record<string, any>) => (
                <div className='flex flex-row gap-4 border-b-[1px] border-neutral-800 pb-6 items-center' key={user.id}>
                    <FaUser size={20} color='white'/>
                    <div className='flex flex-col flex-1'>
                        <p className='text-white font-semibold text-xl'>{user.name}</p>
                        <p className='text-neutral-400 text-m'>@{user.username}</p>
                    </div>
                    <Button label='Unfollow' large={false} onClick={() => {handleUnfollow(user)}} secondary key={user.id}/>
                </div>
            ))
            : 
            <p className='text-neutral-400'>You don't follow anybody yet!</p>}
        </div>
    </div>
  )
}

export default Explore