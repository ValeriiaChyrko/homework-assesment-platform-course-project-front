"use client";

import {Loader2} from "lucide-react";
import {useState} from "react";
import {cn} from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    completeOnEnd: boolean;
    title: string
}

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setReady] = useState(false);

    console.log(`playbackId ${playbackId}`);

    return (
        <div className="relative aspect-video">
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-6=8 h-8 animate-spin text-secondary" />
                </div>
            )}
            <MuxPlayer
                playbackId={playbackId}
                metadataVideoTitle={title}
                onCanPlay={() => setReady(true)}
                onEnded={() => {}}
                autoPlay
                className={cn(
                    !isReady && "hidden"
                )}
            />
        </div>
    )
}