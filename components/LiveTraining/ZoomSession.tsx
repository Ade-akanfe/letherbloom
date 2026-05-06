"use client";

import { useEffect, useState, useRef } from "react";

interface ZoomSessionProps {
    meetingNumber: string;
    userName: string;
    onLeave: () => void;
    userEmail?: string;
    passWord?: string;
}

export default function ZoomSession({
    meetingNumber,
    userName,
    onLeave,
    userEmail = "",
    passWord = "",
}: ZoomSessionProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 1200, height: 750 });

    const isInitializing = useRef(false);

    useEffect(() => {
        const updateSize = () => {
            if (typeof window === "undefined") return;
            setContainerSize({
                width: isFullScreen ? window.innerWidth : Math.min(window.innerWidth - 40, 1200),
                height: isFullScreen ? window.innerHeight : 750
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [isFullScreen]);

    useEffect(() => {
        if (isInitializing.current) return;

        let client: any = null;
        let hasJoined = false;

        const initZoom = async () => {
            try {
                // Ensure DOM is ready
                const root = document.getElementById("meetingSDKElement");
                if (!root) {
                    // Quick retry
                    await new Promise(r => setTimeout(r, 300));
                    if (!document.getElementById("meetingSDKElement")) return;
                }

                setIsLoading(true);
                setError(null);

                const ZoomMtgModule = await import("@zoom/meetingsdk/embedded");
                const ZoomMtgEmbedded = ZoomMtgModule.default || ZoomMtgModule;

                client = ZoomMtgEmbedded.createClient();

                // 1. Signature
                const signatureRes = await fetch("/api/zoom-signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ meetingNumber, role: 0 }),
                });

                const { signature, sdkKey, error: sigError } = await signatureRes.json();

                if (sigError || !signature || !sdkKey) {
                    throw new Error(sigError || "Signature failed");
                }

                await client.init({
                    zoomAppRoot: document.getElementById("meetingSDKElement")!,
                    language: "en-US",
                    customize: {
                        video: {
                            isResizable: true,
                            viewSizes: {
                                default: { width: containerSize.width, height: containerSize.height },
                                ribbon: { width: containerSize.width, height: containerSize.height }
                            }
                        },
                        meetingInfo: ['topic'],
                    }
                });

                await client.join({
                    sdkKey,
                    signature,
                    meetingNumber,
                    password: passWord,
                    userName,
                    userEmail,
                });

                hasJoined = true;
                setIsLoading(false);

            } catch (err: any) {
                console.error("Zoom Error:", err);
                if (err.errorCode === 5012) {
                    setIsLoading(false);
                    return;
                }
                setError(err.message || "Could not join session");
                setIsLoading(false);
            }
        };

        isInitializing.current = true;
        initZoom();

        return () => {
            isInitializing.current = false;
            if (client && hasJoined) {
                try { client.leaveMeeting(); } catch (e) { }
            }
        };
    }, [meetingNumber, userName, userEmail, passWord]);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (error) {
        return (
            <div className="flex bg-black text-white p-8 rounded-2xl items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <p className="text-rose-500 text-xl font-bold mb-2">Notice</p>
                    <p className="text-zinc-400 mb-6">{error}</p>
                    <button onClick={onLeave} className="bg-white text-black px-8 py-2 rounded-full font-bold">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-[9999]' : 'relative w-full h-[750px] rounded-2xl border border-zinc-800'} bg-zinc-950 overflow-hidden shadow-2xl`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #meetingSDKElement {
                    width: 100% !important;
                    height: 100% !important;
                    background: #09090b !important;
                }
                #meetingSDKElement iframe {
                    width: 100% !important;
                    height: 100% !important;
                    border: none !important;
                }
                .zm-meeting-load-screen {
                    background-color: #09090b !important;
                }
            `}} />

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-950 z-[100] gap-4">
                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-400 animate-pulse">Entering Secure Session...</p>
                </div>
            )}

            <div id="meetingSDKElement" className="w-full h-full"></div>

            <div className="absolute top-4 right-4 z-[100] flex gap-2">
                <button onClick={toggleFullScreen} className="bg-zinc-900/90 px-4 py-2 rounded-lg text-white text-sm border border-zinc-700 hover:bg-zinc-800">
                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
                <button onClick={onLeave} className="bg-rose-600 px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-rose-700">
                    Leave
                </button>
            </div>
        </div>
    );
}
