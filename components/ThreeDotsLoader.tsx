"use client";

export default function ThreeDotsLoader({ className = "", color = "bg-rose-600" }: { className?: string, color?: string }) {
    return (
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className={`h-3 w-3 rounded-full ${color} animate-bounce`}
                    style={{
                        animationDelay: `${index * 0.15}s`,
                        animationDuration: "0.8s"
                    }}
                />
            ))}
        </div>
    );
}
