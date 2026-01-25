"use client";

import { useEffect, useState } from "react";

interface ZoomSessionProps {
    meetingNumber: string;
    userName: string;
    onLeave: () => void;
    userEmail?: string;
    passWord?: string;
}

// Detect if user is on mobile device
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function ZoomSession({
    meetingNumber,
    userName,
    onLeave,
    userEmail = "",
    passWord = "",
}: ZoomSessionProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [joinMethod, setJoinMethod] = useState<'selection' | 'web' | 'app'>('selection');
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        // Check if mobile on mount
        const mobile = isMobileDevice();
        setIsMobile(mobile);

        // If mobile, auto-select 'app' method
        if (mobile) {
            setJoinMethod('app');
        }
    }, []);

    useEffect(() => {
        // Only initialize SDK if web method is selected
        if (joinMethod !== 'web') return;

        let client: any = null;
        let hasJoined = false;

        const initZoom = async () => {
            try {
                // Reset loading state when starting fresh
                setIsLoading(true);

                const { default: ZoomMtgEmbedded } = await import("@zoom/meetingsdk/embedded");

                client = ZoomMtgEmbedded.createClient();

                const meetingSDKElement = document.getElementById("meetingSDKElement");
                if (!meetingSDKElement) {
                    console.error("Meeting SDK Element not found");
                    return;
                }

                // 1. Generate Signature
                const { signature, sdkKey, error: sigError } = await fetch("/api/zoom-signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ meetingNumber, role: 0 }),
                }).then((res) => res.json());

                if (sigError || !signature) {
                    throw new Error(sigError || "Failed to generate signature");
                }

                console.log("Signature generated, initializing Embedded Client...");

                // 2. Init
                await client.init({
                    zoomAppRoot: meetingSDKElement,
                    language: "en-US",
                    disableInvite: true, // Prevent showing Invite button
                    customize: {
                        video: {
                            isResizable: true,
                            viewSizes: {
                                default: { width: 1000, height: 600 }
                            }
                        },
                        // Hide meeting info (meeting number, password, etc.) from top bar
                        meetingInfo: [],
                    }
                });

                // 3. Join
                await client.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    password: passWord,
                    userName: userName,
                    userEmail: userEmail,
                });

                hasJoined = true;
                console.log("Successfully joined meeting");
                setIsLoading(false);

            } catch (err: any) {
                console.error("Zoom setup error:", err);
                setError(err.message || "Unknown error occurred");
                setIsLoading(false);
            }
        };

        // Handle page refresh/close - leave meeting to prevent duplicate users
        const handleBeforeUnload = () => {
            if (client && hasJoined) {
                try {
                    client.leaveMeeting();
                    console.log("Left meeting on page unload");
                } catch (e) {
                    console.log("Error leaving meeting on unload:", e);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        initZoom();

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (client && hasJoined) {
                try {
                    client.leaveMeeting();
                    console.log("Left meeting on component unmount");
                } catch (e) {
                    console.log("Error leaving meeting:", e);
                }
            }
        };
    }, [joinMethod, meetingNumber, userName, userEmail, passWord]);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (error) {
        return (
            <div className="flex bg-black text-white p-4 rounded-xl items-center justify-center h-[600px]">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">Error joining session</p>
                    <p className="text-gray-400">{error}</p>
                    <button
                        onClick={onLeave}
                        className="mt-6 rounded-full bg-white px-6 py-2 font-bold text-black"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // View: Join Method Selection (Desktop only)
    if (joinMethod === 'selection' && !isMobile) {
        return (
            <div className="flex bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8 rounded-xl items-center justify-center min-h-[600px]">
                <div className="text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Choose how to join</h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => setJoinMethod('app')}
                            className="w-full p-6 rounded-xl border border-zinc-700 hover:bg-zinc-800/50 transition flex items-center justify-between group"
                        >
                            <div className="text-left">
                                <h3 className="font-bold text-lg mb-1">Join on Zoom App</h3>
                                <p className="text-zinc-400 text-sm">Best performance & features</p>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition">↗</span>
                        </button>

                        <button
                            onClick={() => setJoinMethod('web')}
                            className="w-full p-6 rounded-xl border border-zinc-700 hover:bg-zinc-800/50 transition flex items-center justify-between group"
                        >
                            <div className="text-left">
                                <h3 className="font-bold text-lg mb-1">Join using Web</h3>
                                <p className="text-zinc-400 text-sm">Join instantly in browser</p>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition">→</span>
                        </button>
                    </div>

                    <button
                        onClick={onLeave}
                        className="mt-8 text-sm text-zinc-400 hover:text-white transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // View: Open in App (Mobile or Desktop Selection)
    if (joinMethod === 'app') {
        return (
            <div className="flex bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8 rounded-xl items-center justify-center min-h-[600px]">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto mb-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                            <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Join Training Session</h2>
                    <p className="text-zinc-300 mb-6">
                        Click the button below to open the meeting in your Zoom app.
                    </p>

                    <a
                        href={`zoomus://zoom.us/join?confno=${meetingNumber}&uname=${encodeURIComponent(userName)}${passWord ? `&pwd=${passWord}` : ''}`}
                        className="block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                    >
                        Open in Zoom App
                    </a>

                    <button
                        onClick={onLeave}
                        className="mt-6 text-sm text-zinc-400 hover:text-white transition"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    // View: Embedded Web SDK
    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'relative w-full h-[600px] rounded-xl'} bg-zinc-900 overflow-hidden shadow-2xl transition-all duration-300`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-zinc-900 z-10">
                    <p>Initializing Zoom Session...</p>
                </div>
            )}

            <div id="meetingSDKElement" className="w-full h-full text-white"></div>

            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={toggleFullScreen}
                    className="bg-zinc-800/80 px-4 py-2 rounded text-white font-semibold hover:bg-zinc-700 transition backdrop-blur"
                >
                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
                <button
                    onClick={onLeave}
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold opacity-90 hover:opacity-100 transition"
                >
                    Exit
                </button>
            </div>
        </div>
    );
}
