"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import useLoginModal from '../hooks/LoginModalStore'
import Input from '../component/Input';
import Modal from '../component/Modal';
import useRegisterModal from '../hooks/RegisterModalStore';
import { toast } from 'react-hot-toast';
import useAuthStore from '../hooks/AuthStore';
import { error } from 'console';

const RegisterModal = () => {
    const { token, setToken, clearToken } = useAuthStore();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = useCallback(() => {
        if(isLoading){
            return;
        }
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal, isLoading]);
    
    useEffect(() => {
        console.log(token);
        if(!token && !loginModal.isOpen){
            loginModal.onOpen();
        }
    }, [loginModal]);

    const onSubmit = useCallback(() => {
        try {
            setIsLoading(true);
            
            console.log( name, "A");
            fetch('http://localhost:8000/user/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name, email, password, username})})
                .then((response) => response.json())
                .then((data) => {
                    if(data.error){
                        toast.error('Something went wrong!');
                    }
                    else{
                        setEmail('');
                        setUsername('');
                        setPassword('');
                        setName('');
                        setToken(data.token);
                        toast.success("Registered");
                        registerModal.onClose();
                    }
                    console.log(data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Something went wrong');
                });
        }
        catch (error) {
            toast.error('Something went wrong');
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [loginModal, name, email, username, password]);

    const footerContent = (
        <div className='text-neutral-400 text-center mt-4'>
            <p>Already have an account? <span onClick={onToggle} className='text-white cursor-pointer hover:underline'> Sign in</span></p>
        </div>
    )

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Input placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} disabled={isLoading} />
            <Input placeholder='Username' onChange={(e) => setUsername(e.target.value)} value={username} disabled={isLoading} />
            <Input placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} disabled={isLoading} type='email' />
            <Input placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} disabled={isLoading} type='password' />

        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={registerModal.isOpen} title='Create and account' actionLabel='Register' onClose={registerModal.onClose} onSubmit={onSubmit} body={bodyContent} footer={footerContent}/>
    )
}

export default RegisterModal;