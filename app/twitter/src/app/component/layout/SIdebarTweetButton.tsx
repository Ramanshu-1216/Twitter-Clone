"use client"
import { useRouter } from "next/navigation";
import { FaFeather } from "react-icons/fa";

const SidebarTweetButton = () => {
    const router = useRouter();
    return (
        <div onClick={() => router.push('/')}>
            <div className="mt-6 lg:hidden rounded-full h-14 w-14 flex items-center justify-center bg-sky-500 hover: bg-opacity-80 transition cursor-pointer">
                <FaFeather size={28} color="white" />
            </div>
            <div className="mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer transition">
                <p className="hidden lg:block text-center font-semibold text-white text-[20px]">Post</p>
            </div>
        </div>
    )
}

export default SidebarTweetButton;