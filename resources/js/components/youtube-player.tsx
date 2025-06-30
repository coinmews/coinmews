import { useEffect, useState } from 'react';

interface YouTubePlayerProps {
    videoId: string;
    title: string;
    onError?: () => void;
}

export default function YouTubePlayer({ videoId, title, onError }: YouTubePlayerProps) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Reset error state when video ID changes
        setHasError(false);
    }, [videoId]);

    const handleError = () => {
        console.error('YouTube player error:', { videoId });
        setHasError(true);
        onError?.();
    };

    if (!videoId || hasError) {
        return (
            <div className="bg-muted flex h-full flex-col items-center justify-center gap-4 p-4">
                <p className="text-muted-foreground">{hasError ? 'Unable to load video' : 'No video ID provided'}</p>
                {videoId && (
                    <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Watch on YouTube
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path
                                fillRule="evenodd"
                                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                            />
                        </svg>
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="relative aspect-video w-full">
            <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={handleError}
            />
        </div>
    );
}
