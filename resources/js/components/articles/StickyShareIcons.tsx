import { BrandsTelegram, BrandsWhatsapp, BrandsX } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Copy, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StickyShareIconsProps {
    url: string;
    title: string;
    description?: string;
}

export function StickyShareIcons({ url, title, description = '' }: StickyShareIconsProps) {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Show/hide based on scroll position
            const currentScrollY = window.scrollY;
            const articleStart = 300; // Approximate start of article content
            const articleEnd = document.body.scrollHeight - window.innerHeight - 300; // Approximate end of article
            
            // Only show when we're within the article content area
            setIsVisible(currentScrollY > articleStart && currentScrollY < articleEnd);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const shareOptions = [
        {
            name: 'X (Twitter)',
            icon: <BrandsX className="h-5 w-5" />,
            action: () => {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            },
        },
        {
            name: 'Telegram',
            icon: <BrandsTelegram className="h-5 w-5" />,
            action: () => {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            },
        },
        {
            name: 'WhatsApp',
            icon: <BrandsWhatsapp className="h-5 w-5" />,
            action: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
            },
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="h-5 w-5" />,
            action: () => {
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
                    '_blank',
                );
            },
        },
        {
            name: 'Email',
            icon: <Mail className="h-5 w-5" />,
            action: () => {
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
            },
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    'z-40 flex flex-col items-center gap-3 transition-all duration-300',
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
            >
                <div className="flex flex-col items-center gap-3 rounded-full bg-white p-2 shadow-md dark:bg-neutral-800">
                    {shareOptions.map((option) => (
                        <Tooltip key={option.name}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                    onClick={option.action}
                                    aria-label={`Share on ${option.name}`}
                                >
                                    {option.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{option.name}</TooltipContent>
                        </Tooltip>
                    ))}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('h-10 w-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700', copied && 'text-green-600')}
                                onClick={copyToClipboard}
                                aria-label="Copy link"
                            >
                                <Copy className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{copied ? 'Copied!' : 'Copy link'}</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
