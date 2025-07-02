import AppLogo from '@/components/app-logo';
import { BrandsWhatsapp, BrandsX } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type SearchResult, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Calendar,
    ChevronDown,
    Clock,
    DollarSign,
    FileText,
    HelpCircle,
    History,
    Linkedin,
    Menu,
    Search,
    Settings,
    Tag,
    TrendingUp,
    Youtube,
    Bell,
    User,
    BarChart3,
    Zap,
    Globe,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const subNavItems = [
    {
        title: 'All articles',
        href: '/articles',
        icon: FileText,
        description: 'All articles',
    },
    {
        title: 'Airdrops',
        href: '/airdrops',
        icon: Zap,
        description: 'All airdrops',
    },
    {
        title: 'Presales/ICO',
        href: '/presales',
        icon: DollarSign,
        description: 'All presales/ico',
    },
    {
        title: 'Events',
        href: '/events',
        icon: Calendar,
        description: 'Crypto events calendar',
    },
    {
        title: 'Listings',
        href: '/crypto-exchange-listings',
        icon: BarChart3,
        description: 'New token listings',
    },
    {
        title: 'Memes',
        href: '/cryptocurrency-memes',
        icon: Tag,
        description: 'Latest memes',
    },
    {
        title: 'Videos',
        href: '/cryptocurrency-videos',
        icon: Youtube,
        description: 'Latest videos',
    },
];

const socialLinks = [
    { icon: BrandsWhatsapp, href: 'https://wa.me/1234567890', label: 'WhatsApp' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/CoinMews', label: 'LinkedIn' },
    { icon: BrandsX, href: 'https://x.com/CoinMews_io', label: 'X (Twitter)' },
    { icon: Youtube, href: 'https://www.youtube.com/@CoinMews', label: 'YouTube' },
];

const contentTypes = [
    {
        group: 'Crypto News',
        items: [
            { title: 'All News', href: '/news' },
            { title: 'Crypto News', href: '/news' },
            { title: 'Short News', href: '/articles?content_type=short_news' },
            { title: 'Press Release', href: '/articles?content_type=press_release' },
            { title: 'Web3 Bulletin', href: '/articles?content_type=web3_bulletin' },
            { title: 'Price Prediction', href: '/articles?content_type=price_prediction' },
            { title: 'Sponsored', href: '/articles?content_type=sponsored' },
        ],
    },
    {
        group: 'Crypto Blogs',
        items: [
            { title: 'All Blogs', href: '/blog' },
            { title: 'Crypto Blogs', href: '/blog' },
            { title: 'Research Report', href: '/articles?content_type=research_report' },
            { title: 'Guest Post', href: '/articles?content_type=guest_post' },
            { title: 'Web Story', href: '/articles?content_type=web_story' },
        ],
    },
];

// Structure for Airdrops popover
const airdropCategories = {
    status: [
        { title: 'All Airdrops', href: '/airdrops' },
        { title: 'Ongoing Airdrops', href: '/airdrops?status=ongoing' },
        { title: 'Upcoming Airdrops', href: '/airdrops?status=upcoming' },
        { title: 'Potential Airdrops', href: '/airdrops?status=potential' },
        { title: 'Ended Airdrops', href: '/airdrops?status=ended' },
        { title: 'Featured Airdrops', href: '/airdrops?featured=1' },
    ],
    blockchains: [
        { title: 'Ethereum', href: '/airdrops?blockchain=ethereum' },
        { title: 'Solana', href: '/airdrops?blockchain=solana' },
        { title: 'BNB Chain', href: '/airdrops?blockchain=bnb' },
        { title: 'Polygon', href: '/airdrops?blockchain=polygon' },
        { title: 'Avalanche', href: '/airdrops?blockchain=avalanche' },
        { title: 'Arbitrum', href: '/airdrops?blockchain=arbitrum' },
        { title: 'Optimism', href: '/airdrops?blockchain=optimism' },
        { title: 'Base', href: '/airdrops?blockchain=base' },
    ],
};

// Structure for Presales/ICO popover
const presaleCategories = {
    status: [
        { title: 'All Presales', href: '/presales' },
        { title: 'Ongoing Presales', href: '/presales?status=ongoing' },
        { title: 'Upcoming Presales', href: '/presales?status=upcoming' },
        { title: 'Ended Presales', href: '/presales?status=ended' },
    ],
    stages: [
        { title: 'ICO', href: '/presales?stage=ico' },
        { title: 'IDO', href: '/presales?stage=ido' },
        { title: 'IEO', href: '/presales?stage=ieo' },
    ],
};

export default function Header() {
    const page = usePage<SharedData>();
    const { auth, navigationCategories = [] } = page.props;
    const getInitials = useInitials();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [open, setOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState(['Latest Crypto News', 'Bitcoin Price Analysis', 'Ethereum Updates']);
    const [_popularSearches] = useState(['NFT Market Trends', 'DeFi Projects', 'Crypto Regulations']);
    const rafRef = useRef<number | null>(null);
    const lastScrollTop = useRef(0);
    const progressRef = useRef<HTMLDivElement>(null);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [airdropMenuOpen, setAirdropMenuOpen] = useState(false);
    const [presaleMenuOpen, setPresaleMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        const lastTime = 0;
        const throttle = 16; // ~60fps

        const calculateScrollProgress = (time: number) => {
            if (time - lastTime < throttle) {
                rafRef.current = requestAnimationFrame(calculateScrollProgress);
                return;
            }

            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;

            if (Math.abs(currentScroll - lastScrollTop.current) > 1) {
                const progress = (currentScroll / totalHeight) * 100;
                setScrollProgress(progress);
                lastScrollTop.current = currentScroll;
            }

            rafRef.current = requestAnimationFrame(calculateScrollProgress);
        };

        rafRef.current = requestAnimationFrame(calculateScrollProgress);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSearch = (value: string) => {
        setSearchQuery(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (value.trim()) {
            setIsSearching(true);
            searchTimeout.current = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
                    const data = await response.json();
                    console.log('Search results:', data);
                    setSearchResults(data.results || []);
                } catch (error) {
                    console.error('Search failed:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 300);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }

        if (value && !recentSearches.includes(value)) {
            setRecentSearches((prev) => [value, ...prev].slice(0, 5));
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* Scroll Progress Bar */}
            <div
                ref={progressRef}
                className="bg-gradient-to-r from-primary via-secondary to-accent fixed top-0 left-0 z-50 h-1 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Top Bar - Social Links & Theme */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border/20">
                <div className="mx-auto flex h-10 items-center justify-between px-6 md:max-w-7xl">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="hidden sm:inline-flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Global Crypto News
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="hidden items-center space-x-2 sm:flex">
                            {socialLinks.map((social) => (
                                <TooltipProvider key={social.label} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={social.href}
                                                className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-foreground"
                                                aria-label={social.label}
                                                target="_blank"
                                            >
                                                <social.icon className="h-4 w-4" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{social.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - Logo, Search, Auth */}
            <div className="bg-background/95 backdrop-blur-sm border-b border-border/50">
                <div className="mx-auto flex h-16 items-center justify-between px-6 md:max-w-7xl">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 transition-all duration-150 ease-in-out hover:scale-105 active:scale-100"
                    >
                        <AppLogo />
                    </Link>

                    {/* Center Search Bar */}
                    <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
                        <div className="relative w-full max-w-xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search crypto news, airdrops, presales..."
                                    className="w-full rounded-full border border-border bg-background/50 px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                                    onClick={() => setOpen(true)}
                                    readOnly
                                />
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Auth & Mobile Menu */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Search */}
                        <div className="lg:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-9 rounded-full p-1">
                                        <Avatar className="size-7 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar || undefined} alt={auth.user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        <User className="mr-2 h-4 w-4" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-sm">
                                    <div className="flex h-full flex-col">
                                        <div className="border-b border-border/50 px-6 py-4">
                                            <Link href="/" className="flex items-center space-x-2">
                                                <AppLogo />
                                            </Link>
                                        </div>

                                        <div className="flex-1 overflow-y-auto py-6">
                                            <div className="flex flex-col space-y-1 px-6">
                                                {subNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className={cn(
                                                            'group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                                            page.url === item.href
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                        )}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        <div className="flex flex-col">
                                                            <span>{item.title}</span>
                                                            <span className="text-xs text-muted-foreground">{item.description}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-border/50 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Follow Us</span>
                                                <div className="flex items-center space-x-2">
                                                    {socialLinks.map((social) => (
                                                        <a
                                                            key={social.label}
                                                            href={social.href}
                                                            className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-foreground"
                                                            target="_blank"
                                                        >
                                                            <social.icon className="h-4 w-4" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-muted/30 border-b border-border/30">
                <nav className="mx-auto hidden max-w-7xl items-center justify-start px-6 py-3 lg:flex">
                    <div className="flex items-center space-x-1">
                        {/* News Mega Menu */}
                        <div className="relative">
                            <Popover open={megaMenuOpen} onOpenChange={setMegaMenuOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                            megaMenuOpen 
                                                ? 'bg-primary/10 text-primary' 
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <FileText className="h-4 w-4" />
                                        News
                                        <ChevronDown className={cn('h-4 w-4 transition-transform', megaMenuOpen && 'rotate-180')} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[600px] rounded-xl border border-border bg-background/95 backdrop-blur-sm p-0 shadow-xl"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <div className="grid grid-cols-2 gap-0">
                                        {contentTypes.map((group, index) => (
                                            <div key={index} className={cn('p-6', index === 0 && 'border-r border-border/50')}>
                                                <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                                    {group.group === 'Crypto News' ? <FileText className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                                                    {group.group}
                                                </h3>
                                                <div className="space-y-2">
                                                    {group.items.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Airdrops */}
                        <div className="relative">
                            <Popover open={airdropMenuOpen} onOpenChange={setAirdropMenuOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                            airdropMenuOpen 
                                                ? 'bg-primary/10 text-primary' 
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <Zap className="h-4 w-4" />
                                        Airdrops
                                        <ChevronDown className={cn('h-4 w-4 transition-transform', airdropMenuOpen && 'rotate-180')} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[500px] rounded-xl border border-border bg-background/95 backdrop-blur-sm p-0 shadow-xl"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <div className="grid grid-cols-2 gap-0">
                                        <div className="p-6 border-r border-border/50">
                                            <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Status
                                            </h3>
                                            <div className="space-y-2">
                                                {airdropCategories.status.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4" />
                                                Blockchains
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {airdropCategories.blockchains.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Presales/ICO */}
                        <div className="relative">
                            <Popover open={presaleMenuOpen} onOpenChange={setPresaleMenuOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                            presaleMenuOpen 
                                                ? 'bg-primary/10 text-primary' 
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <DollarSign className="h-4 w-4" />
                                        Presales
                                        <ChevronDown className={cn('h-4 w-4 transition-transform', presaleMenuOpen && 'rotate-180')} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[400px] rounded-xl border border-border bg-background/95 backdrop-blur-sm p-0 shadow-xl"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <div className="grid grid-cols-2 gap-0">
                                        <div className="p-6 border-r border-border/50">
                                            <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Status
                                            </h3>
                                            <div className="space-y-2">
                                                {presaleCategories.status.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Stages
                                            </h3>
                                            <div className="space-y-2">
                                                {presaleCategories.stages.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Other Navigation Items */}
                        <Link
                            href="/events"
                            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                            <Calendar className="h-4 w-4" />
                            Events
                        </Link>

                        <Link
                            href="/crypto-exchange-listings"
                            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Listings
                        </Link>

                        <Link
                            href="/cryptocurrency-memes"
                            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                            <Tag className="h-4 w-4" />
                            Memes
                        </Link>

                        <Link
                            href="/cryptocurrency-videos"
                            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                            <Youtube className="h-4 w-4" />
                            Videos
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Search Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput 
                    placeholder="Search crypto news, airdrops, presales..." 
                    value={searchQuery}
                    onValueChange={handleSearch}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {isSearching && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    )}
                    {!isSearching && searchResults.length > 0 && (
                        <CommandGroup heading="Search Results">
                            {searchResults.map((result) => (
                                <CommandItem
                                    key={result.id}
                                    onSelect={() => {
                                        router.visit(result.url);
                                        setOpen(false);
                                    }}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>{result.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {!isSearching && searchQuery && searchResults.length === 0 && (
                        <CommandGroup heading="Recent Searches">
                            {recentSearches.map((search) => (
                                <CommandItem
                                    key={search}
                                    onSelect={() => {
                                        setSearchQuery(search);
                                        handleSearch(search);
                                    }}
                                >
                                    <History className="mr-2 h-4 w-4" />
                                    <span>{search}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </div>
    );
}
