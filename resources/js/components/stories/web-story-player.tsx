import { Article, StorySlide } from '@/types/articleTypes';
import { ChevronLeft, ChevronRight, Loader2, Pause, Play, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface WebStoryPlayerProps {
    article: Article;
    onClose: () => void;
}

const WebStoryPlayer: React.FC<WebStoryPlayerProps> = ({ article, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const parseJsonArray = <T,>(jsonString: string | undefined | T[], fallback: T[]): T[] => {
        if (Array.isArray(jsonString)) return jsonString;
        if (!jsonString) return fallback;
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch {
            return fallback;
        }
    };

    const slides = parseJsonArray<StorySlide>(article.story_slides, []);
    const totalDuration = article.story_duration ? article.story_duration * 1000 : 5000; // Total duration in ms
    const slideDuration = totalDuration / (article.slides_count || slides.length); // Duration per slide in ms

    useEffect(() => {
        // Reset progress when changing slides
        setProgress(0);
        setIsLoading(true);

        // Auto-advance timer
        let progressInterval: NodeJS.Timeout;
        let slideTimeout: NodeJS.Timeout;

        if (!isPaused) {
            const startTime = Date.now();
            progressInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = (elapsedTime / slideDuration) * 100;

                if (newProgress >= 100) {
                    setProgress(100);
                } else {
                    setProgress(newProgress);
                }
            }, 16); // ~60fps update

            slideTimeout = setTimeout(() => {
                if (currentSlide < slides.length - 1) {
                    setCurrentSlide(currentSlide + 1);
                } else {
                    onClose();
                }
            }, slideDuration);
        }

        return () => {
            clearInterval(progressInterval);
            clearTimeout(slideTimeout);
        };
    }, [currentSlide, isPaused, slides.length, onClose, slideDuration]);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        const touch = e.touches[0];
        const startX = touch.clientX;

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const diff = touch.clientX - startX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentSlide > 0) {
                    handlePrevious();
                } else if (diff < 0 && currentSlide < slides.length - 1) {
                    handleNext();
                }
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };

        const handleTouchEnd = () => {
            setIsPaused(false);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Progress Bars */}
            <div className="absolute top-0 right-0 left-0 z-40 flex gap-1 p-2">
                {slides.map((_, index) => (
                    <div key={index} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                        <div
                            className="h-full bg-white transition-all duration-100"
                            style={{
                                width: `${index === currentSlide ? progress : index < currentSlide ? 100 : 0}%`,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Story Content */}
            <div
                className="relative h-full w-full"
                onTouchStart={handleTouchStart}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    if (x > rect.width / 2) {
                        handleNext();
                    } else {
                        handlePrevious();
                    }
                }}
            >
                {/* Current Slide */}
                <div className="relative h-full w-full">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                    <img
                        src={slides[currentSlide]?.image}
                        alt={`Story slide ${currentSlide + 1}`}
                        className="h-full w-full object-cover"
                        onLoad={() => setIsLoading(false)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

                    {/* Story Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.content || '' }} />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrevious();
                    }}
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-1 text-white backdrop-blur-sm transition-all hover:bg-black/40 disabled:opacity-50"
                    disabled={currentSlide === 0}
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-1 text-white backdrop-blur-sm transition-all hover:bg-black/40 disabled:opacity-50"
                    disabled={currentSlide === slides.length - 1}
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsPaused(!isPaused);
                    }}
                    className="absolute right-4 bottom-4 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
};

export default WebStoryPlayer;
