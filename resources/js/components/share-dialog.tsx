import { BrandsTelegram, BrandsWhatsapp, BrandsX } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Linkedin, Mail, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareOption {
    name: string;
    icon: React.ReactNode;
    action: (url: string, title: string, description: string) => void;
}

interface ShareDialogProps {
    url: string;
    title: string;
    description?: string;
    trigger?: React.ReactNode;
}

export default function ShareDialog({ url, title, description = '', trigger }: ShareDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareOptions: ShareOption[] = [
        {
            name: 'X (Twitter)',
            icon: <BrandsX className="h-6 w-6" />,
            action: (url, title) => {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            },
        },
        {
            name: 'Telegram',
            icon: <BrandsTelegram className="h-6 w-6" />,
            action: (url, title) => {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            },
        },
        {
            name: 'WhatsApp',
            icon: <BrandsWhatsapp className="h-6 w-6" />,
            action: (url, title) => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
            },
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="h-6 w-6" />,
            action: (url, title, description) => {
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
                    '_blank',
                );
            },
        },
        {
            name: 'Email',
            icon: <Mail className="h-6 w-6" />,
            action: (url, title, description) => {
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
            },
        },
    ];

    const handleShare = async (option: ShareOption) => {
        try {
            if (navigator.share && option.name === 'Native') {
                await navigator.share({
                    title,
                    text: description,
                    url,
                });
            } else {
                option.action(url, title, description);
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share');
        }
    };

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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader className="space-y-3 pb-4">
                    <DialogTitle className="text-2xl">Share</DialogTitle>
                    <DialogDescription className="text-base">Share this content with your network</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6">
                    {/* Social Share Buttons */}
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                        {shareOptions.map((option) => (
                            <Button
                                key={option.name}
                                variant="outline"
                                className="group flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-2 p-0 transition-all duration-200 hover:scale-105 hover:bg-neutral-50 active:scale-95 dark:hover:bg-neutral-900"
                                onClick={() => handleShare(option)}
                            >
                                <div className="transition-transform duration-200 group-hover:-translate-y-0.5">{option.icon}</div>
                                <span className="text-xs font-medium">{option.name}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="flex items-center gap-3 rounded-lg border p-2">
                        <Input value={url} readOnly className="flex-1 border-0 bg-transparent px-2 focus-visible:ring-0" />
                        <Button
                            type="button"
                            variant={copied ? 'default' : 'outline'}
                            className={`shrink-0 gap-2 transition-all duration-200 ${copied ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                            onClick={copyToClipboard}
                        >
                            {copied ? (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
