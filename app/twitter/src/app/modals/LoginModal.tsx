"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useLoginModal from '../hooks/LoginModalStore'
import Input from '../component/Input';
import Modal from '../component/Modal';
import useRegisterModal from '../hooks/RegisterModalStore';
import { toast } from 'react-hot-toast';
import useAuthStore from '../hooks/AuthStore';

const LoginModal = () => {
    const { token, setToken, clearToken } = useAuthStore();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(token == null && localStorage.getItem('JwtToken') != null){
            setToken(localStorage.getItem('JwtToken'));
        }
    }, []);
    
    useEffect(() => {
        if(token && token != 'null'){
            loginModal.onClose();
        }
    }, [token]);

    const onToggle = useCallback(() => {
        if (isLoading) {
            return;
        }
        registerModal.onOpen();
        loginModal.onClose();
    }, [loginModal, registerModal, isLoading]);

    const onSubmit = useCallback(() => {
        try {
            setIsLoading(true);
            fetch('http://localhost:8000/user/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: password }) })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        toast.error("Invalid credentials");
                    }
                    else {
                        setPassword('');
                        setToken(data.token);
                        loginModal.onClose();
                        toast.success("Logged in");
                    }
                });

        }
        catch (error) {
            console.log(error);
            toast.success("Something went wrong!");
        }
        finally {
            setIsLoading(false);
        }
    }, [loginModal, email, password]);

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Input placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} disabled={isLoading} type='email' />
            <Input placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} disabled={isLoading} type='password' />

        </div>
    );

    const footerContent = (
        <div className='text-neutral-400 text-center mt-4'>
            <p>First time using twitter? <span onClick={onToggle} className='text-white cursor-pointer hover:underline'> Create an account</span></p>
        </div>
    );

    return (
        <Modal disabled={isLoading} isOpen={loginModal.isOpen} title='Login' actionLabel='Sign In' onClose={loginModal.onClose} onSubmit={onSubmit} body={bodyContent} footer={footerContent} />
    )
}

export default LoginModal
