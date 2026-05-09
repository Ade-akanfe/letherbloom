"use client";

import { useEffect, useRef, useState } from "react";

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
    const [showAudioTip, setShowAudioTip] = useState(false);

    const clientRef = useRef<any>(null);
    const initializedRef = useRef(false);

    const cleanupZoom = async () => {

        try {

            if (clientRef.current) {

                try {
                    await clientRef.current.leaveMeeting();
                } catch { }

                try {
                    await clientRef.current.destroyClient();
                } catch { }
            }

        } catch (e) {
            console.log("Cleanup Error:", e);
        }

        clientRef.current = null;
        initializedRef.current = false;
    };

    useEffect(() => {

        if (initializedRef.current) return;

        initializedRef.current = true;

        let mounted = true;

        const initZoom = async () => {

            try {

                setIsLoading(true);
                setError(null);

                const root =
                    document.getElementById(
                        "meetingSDKElement"
                    );

                if (!root) {
                    throw new Error(
                        "Zoom container not found"
                    );
                }

                const ZoomMtgModule = await import(
                    "@zoom/meetingsdk/embedded"
                );

                const ZoomMtgEmbedded =
                    ZoomMtgModule.default ||
                    ZoomMtgModule;

                const client =
                    ZoomMtgEmbedded.createClient();

                clientRef.current = client;

                // Generate signature
                const signatureRes = await fetch(
                    "/api/zoom-signature",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            meetingNumber,
                            role: 0,
                        }),
                    }
                );

                const {
                    signature,
                    sdkKey,
                    error: sigError,
                } = await signatureRes.json();

                if (
                    sigError ||
                    !signature ||
                    !sdkKey
                ) {
                    throw new Error(
                        sigError ||
                        "Failed to generate signature"
                    );
                }

                await client.init({
                    zoomAppRoot: root,

                    language: "en-US",

                    customize: {

                        video: {

                            isResizable: true,

                            defaultViewType:
                                "speaker" as any,

                            viewSizes: {

                                default: {
                                    width:
                                        window.innerWidth <=
                                            768
                                            ? window.innerWidth
                                            : 1200,

                                    height:
                                        window.innerWidth <=
                                            768
                                            ? window.innerHeight -
                                            100
                                            : 750,
                                },

                                ribbon: {
                                    width:
                                        window.innerWidth <=
                                            768
                                            ? window.innerWidth
                                            : 1200,

                                    height:
                                        window.innerWidth <=
                                            768
                                            ? window.innerHeight -
                                            100
                                            : 750,
                                },

                                speaker: {
                                    width:
                                        window.innerWidth <=
                                            768
                                            ? window.innerWidth
                                            : 1200,

                                    height:
                                        window.innerWidth <=
                                            768
                                            ? window.innerHeight -
                                            100
                                            : 750,
                                },
                            } as any,
                        },

                        meetingInfo: [
                            "topic",
                            "host",
                            "participant",
                        ],
                    },
                });

                // Fail-safe connection listener to remove loader
                client.on("meeting-status" as any, (payload: any) => {
                    if (payload.status === 2 && mounted) {
                        setIsLoading(false);
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

                if (!mounted) return;

                setIsLoading(false);

                // Auto pin host
                try {

                    const participants =
                        (client as any).getAllUser();

                    const host =
                        participants.find(
                            (p: any) => p.isHost
                        );

                    if (host) {
                        (client as any).pinVideo(
                            host.userId
                        );
                    }

                } catch { }

                if (!mounted) return;

                setIsLoading(false);

                setTimeout(() => {

                    if (mounted) {
                        setShowAudioTip(true);
                    }

                }, 2000);

                setTimeout(() => {

                    if (mounted) {
                        setShowAudioTip(false);
                    }

                }, 10000);

            } catch (err: any) {

                console.error(
                    "Zoom Join Error:",
                    err
                );

                if (!mounted) return;

                let message =
                    "Unable to join session";

                if (
                    err?.errorCode === 200 ||
                    err?.errorCode === 1 ||
                    err?.errorCode === 4000 ||
                    err?.errorCode === 4001 ||
                    err?.errorCode === 5012
                ) {
                    message =
                        "Connection interrupted. Please refresh and try again.";
                } else if (err?.message) {
                    message = err.message;
                }

                setError(message);

                setIsLoading(false);

                initializedRef.current = false;
            }
        };

        initZoom();

        return () => {
            mounted = false;
        };

    }, []);

    // Update Zoom video context when full screen is toggled
    useEffect(() => {
        if (clientRef.current && !isLoading) {
            try {
                clientRef.current.updateVideoViewContext({
                    canvasWidth: isFullScreen ? window.innerWidth : (window.innerWidth <= 768 ? window.innerWidth : 1200),
                    canvasHeight: isFullScreen ? window.innerHeight : (window.innerWidth <= 768 ? window.innerHeight - 100 : 750),
                });
            } catch (e) {
                console.error("Failed to update Zoom context", e);
            }
        }
    }, [isFullScreen, isLoading]);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (error) {

        return (
            <div className="flex bg-black text-white p-8 rounded-2xl items-center justify-center min-h-[500px]">

                <div className="text-center">

                    <p className="text-rose-500 text-xl font-bold mb-2">
                        Notice
                    </p>

                    <p className="text-zinc-400 mb-6">
                        {error}
                    </p>

                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="bg-white text-black px-8 py-2 rounded-full font-bold"
                    >
                        Retry Connection
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div
            className={`${isFullScreen
                    ? "fixed inset-0 z-[9999]"
                    : "relative w-full h-[500px] sm:h-[750px] rounded-2xl border border-zinc-800"
                } bg-zinc-950 shadow-2xl`}
        >

            <style
                dangerouslySetInnerHTML={{
                    __html: `

                    #meetingSDKElement {
                        width: 100% !important;
                        height: 100% !important;
                        background: #000 !important;
                    }

                    #meetingSDKElement iframe {
                        width: 100% !important;
                        height: 100% !important;
                        border: none !important;
                    }

                    .meeting-app {
                        width: 100% !important;
                        height: 100% !important;
                    }

                    .zm-meeting-load-screen {
                        background-color: #000 !important;
                    }

                    `,
                }}
            />

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black z-[100] gap-4">

                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-zinc-400 animate-pulse">
                        Entering Secure Session...
                    </p>

                </div>
            )}

            {showAudioTip && !isLoading && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000]">

                    <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">

                        <div className="text-lg">
                            🎤
                        </div>

                        <div className="flex flex-col">

                            <p className="text-sm font-bold">
                                Join Audio to Talk
                            </p>

                            <p className="text-[10px] opacity-90">
                                Tap the microphone button below
                            </p>

                        </div>

                    </div>

                </div>
            )}

            <div
                id="meetingSDKElement"
                className="w-full h-full"
            />

            <div className="absolute top-4 right-4 z-[100] flex gap-2">

                <button
                    onClick={toggleFullScreen}
                    className="bg-zinc-900/90 px-4 py-2 rounded-lg text-white text-sm border border-zinc-700 hover:bg-zinc-800"
                >
                    {isFullScreen
                        ? "Exit Full Screen"
                        : "Full Screen"}
                </button>

                <button
                    onClick={async () => {

                        await cleanupZoom();

                        onLeave();
                    }}
                    className="bg-rose-600 px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-rose-700"
                >
                    Leave
                </button>

            </div>

        </div>
    );
}