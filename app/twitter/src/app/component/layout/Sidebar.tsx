"use client"
import { FaHome, FaRegBell, FaRegUser, FaSearch } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi'
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarTweetButton from './SIdebarTweetButton';
import useAuthStore from '@/app/hooks/AuthStore';
const Sidebar = () => {
    const useAuth = useAuthStore();
    const items = [
        {
            label: 'Home',
            href: '/',
            icon: FaHome,
        },
        {
            label: 'Explore',
            href: '/explore',
            icon: FaSearch,
        },
        {
            label: 'Notifications',
            href: '/notifications',
            icon: FaRegBell,
        },
        {
            label: 'Profile',
            href: '/users/' + useAuth.user?._id,
            icon: FaRegUser,
        },
    ]
    const logout = () => {
        console.log("log")
        useAuth.clearToken();
        localStorage.removeItem('JwtToken');
    }
    return (
        <div className='col-span-1 h-hull pr-0 md:pr-6'>
            <div className='flex flex-col items-center min-h-screen'>
                <div className='space-y-2 lg:w-[240px] fixed'>
                    <SidebarLogo />
                    {items.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon} />
                    ))}
                    <SidebarTweetButton />z
                </div>
                <div className='lg:w-[240px] fixed bottom-0'>
                    {
                        useAuth.token ?
                            <SidebarItem onClick={logout} label='Logout' icon={BiLogOut} key={'/logout'} />
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );
}

export default Sidebar;