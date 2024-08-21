'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface UserInfo {
    username: string;
    email: string;
    isVerified: boolean;
    _id: string;
}

const Profile = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState('');
    const [logOutErr, setLogOutErr] = useState('');

    useEffect(() => {
        const getLoggedInUserData = async () => {
            try {
                const response = await axios.get('/api/users/me');

                if (response.data.success) {
                    setUserInfo(response.data.user);
                }
            } catch (err: any) {
                if (err.response) {
                    console.log("Server error:", err.response.data.message);
                    setError(err.response.data.message);
                } else if (err.request) {
                    console.log("Network error:", err.message);
                    setError("Network error: " + err.message);
                } else {
                    console.log("Error:", err.message);
                    setError("An unexpected error occurred: " + err.message);
                }
            }
        };
        getLoggedInUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.get('/api/users/logout');

            if (response.data.success) {
                router.push("/login");
            }
        } catch (err: any) {
            if (err.response) {
                console.log("Server error:", err.response.data.message);
                setLogOutErr(err.response.data.message);
            } else if (err.request) {
                console.log("Network error:", err.message);
                setLogOutErr("Network error: " + err.message);
            } else {
                console.log("Error:", err.message);
                setLogOutErr("An unexpected error occurred: " + err.message);
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            Profile
            {userInfo ? (
                <div className='flex flex-col items-center justify-center'>
                    <p>{userInfo.username}</p>
                    <p>{userInfo.email}</p>
                    <p>{userInfo.isVerified ? "✔️" : "❌"}</p>
                    <button className='bg-green-800 text-white rounded p-2 w-full'><Link href={`/profile/${userInfo._id}`}>click</Link></button>
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
            <button
                onClick={handleLogout}
                className='bg-red-600 text-white mt-2 border rounded-md p-2 '>
                Logout
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {logOutErr && <p className="text-red-500 mt-4">{logOutErr}</p>}
        </div>
    );
}

export default Profile;
