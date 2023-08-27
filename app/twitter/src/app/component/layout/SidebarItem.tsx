"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface SidebarItemPros {
    label: string,
    href?: string,
    icon: IconType,
    onClick?: () => void,
}
const SidebarItem:React.FC<SidebarItemPros> = ({label, href, icon :Icon, onClick}) => {
    const router = useRouter();
    
    return (
        <div className="flex flex-row items-center" onClick={() => href ? router.push(href) : onClick()}>
            <div className="relative rounded-full h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer lg:hidden">
                <Icon size={28} color="white"/>
            </div>
            <div className="relative hidden lg:flex item-center gap-4 p-4 rounded-full hover: hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer">
                <Icon size={24} color="white" />
                <p className="hidden lg:block text-white text-xl">{label}</p>
            </div>
        </div>
    )
};

export default SidebarItem;