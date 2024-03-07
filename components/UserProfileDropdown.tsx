// UserProfileDropdown.jsx or UserProfileDropdown.tsx if you're using TypeScript

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";

export const UserProfileDropdown = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (!session) {
        return <div>Loading...</div>;
    }

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2">
                <UserAvatar user={{ name: session.user.name, image: session.user.image }} className="h-8 w-8" />
                <span>{session.user.name}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700">Settings</a>
                        <button
                            onClick={() => signOut()}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
