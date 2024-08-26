'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const VerifyEmail = () => {
    const [token, setToken] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState("")

    const verifyEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            setIsVerified(true);

        } catch (err: any) {
            if (err.response) {
                // Server responded with a status other than 2xx
                console.log("Server error:", err.response.data.message);
                setError(err.response.data.message);

            } else if (err.request) {
                // Request was made but no response was received
                console.log("Network error:", err.message);
                setError("Network error: " + err.message);

            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error:", err.message);
                setError("An unexpected error occurred: " + err.message);
            }
        }

    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")
        [1];

        setToken(urlToken || "")

    }, [])

    useEffect(() => {
        if (token.length > 0) verifyEmail();

    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {error ? (
                <p className="text-red-700">{error}</p>
            ) : (
                !isVerified ? (
                    <p>Verifying your account...</p>
                ) : (
                    <div>
                        <p className="text-green-900">Account verified!</p>
                        <Link href="/login" className="text-blue-600">Login</Link>
                    </div>
                )
            )}
        </div>
    )
}

export default VerifyEmail