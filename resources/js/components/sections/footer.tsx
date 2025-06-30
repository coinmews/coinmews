import AppLogoIcon from '@/components/app-logo-icon';
import { BrandsFacebook, BrandsTelegram, BrandsWhatsapp, BrandsX } from '@/components/icons';
import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Mail, Youtube } from 'lucide-react';

interface LinkItem {
    title: string;
    href: string;
}

const mainNavItems: LinkItem[] = [
    // { title: 'All Articles', href: '/articles' },
    { title: 'News', href: '/news' },
    { title: 'Blog', href: '/blog' },
    // { title: 'Categories', href: '/categories' },
    // { title: 'Airdrops', href: '/airdrops' },
    // { title: 'Presales/ICO', href: '/presales' },
    { title: 'Events', href: '/events' },
    { title: 'Listings', href: '/listings' },
    { title: 'Submit', href: '/submissions' },
    // { title: 'Advertise', href: '/advertise' },
];

const legalLinks: LinkItem[] = [
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Cookie Policy', href: '/legal/cookies' },
    { title: 'Sitemap', href: '/legal/sitemap' },
    { title: 'Accessibility', href: '/legal/accessibility' },
];

const socialLinks = [
    { icon: BrandsWhatsapp, href: 'https://wa.me/1234567890', label: 'WhatsApp' },
    { icon: BrandsTelegram, href: 'https://t.me/Token_Feed', label: 'Telegram' },
    { icon: BrandsX, href: 'https://x.com/CoinMews_io', label: 'X (Twitter)' },
    { icon: BrandsFacebook, href: 'https://www.facebook.com/CoinMews.io', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/CoinMews', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/CoinMews', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/@CoinMews', label: 'YouTube' },
];

// Category links from header
const contentCategories: LinkItem[] = [
    { title: 'Crypto News', href: '/news' },
    { title: 'Short News', href: '/articles?content_type=short_news' },
    { title: 'Press Release', href: '/articles?content_type=press_release' },
    { title: 'Web3 Bulletin', href: '/articles?content_type=web3_bulletin' },
    { title: 'Price Prediction', href: '/articles?content_type=price_prediction' },
];

const airdropCategories: LinkItem[] = [
    { title: 'Ongoing Airdrops', href: '/airdrops?status=ongoing' },
    { title: 'Upcoming Airdrops', href: '/airdrops?status=upcoming' },
    { title: 'Potential Airdrops', href: '/airdrops?status=potential' },
    { title: 'Ended Airdrops', href: '/airdrops?status=ended' },
    { title: 'Featured Airdrops', href: '/airdrops?featured=1' },
];

const presaleCategories: LinkItem[] = [
    { title: 'Ongoing Presales', href: '/presales?status=ongoing' },
    { title: 'Upcoming Presales', href: '/presales?status=upcoming' },
    { title: 'Ended Presales', href: '/presales?status=ended' },
    { title: 'ICO', href: '/presales?stage=ico' },
    { title: 'IDO', href: '/presales?stage=ido' },
];

const contactInfo = [
    {
        icon: Mail,
        label: 'Email',
        value: 'contact@CoinMews.io',
        href: 'mailto:contact@CoinMews.com',
    },
];

export default function Footer() {
    return (
        <footer className="w-full bg-neutral-900 text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Company Info */}
                    <div className="space-y-8 lg:col-span-4">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-2 text-white">
                                <AppLogoIcon className="size-6 fill-current text-white dark:text-black" />
                                <span className="ml-1 font-semibold">CoinMews</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-neutral-400">
                            CoinMews is at the forefront of innovation, delivering cutting-edge crypto news, airdrops, and insights that empower
                            users to "Unlock Tomorrow." As a global leader, we drive transformative ideas that shape the future of blockchain and
                            redefine what's possible.
                        </p>
                        <div className="space-y-4">
                            {contactInfo.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center space-x-3 text-sm text-neutral-400 transition-colors hover:text-white"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.value}</span>
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="rounded-full bg-neutral-800 p-2.5 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                                    aria-label={social.label}
                                    target="_blank"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 lg:col-span-8 lg:grid-cols-4">
                        {/* Navigation Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Navigation</h3>
                            <ul className="space-y-3">
                                {mainNavItems.map((item) => (
                                    <li key={item.title}>
                                        <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Content Categories */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Content</h3>
                            <ul className="space-y-3">
                                {contentCategories.map((item) => (
                                    <li key={item.title}>
                                        <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Airdrops Categories */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Airdrops</h3>
                            <ul className="space-y-3">
                                {airdropCategories.map((item) => (
                                    <li key={item.title}>
                                        <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Presales Categories */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Presales</h3>
                            <ul className="space-y-3">
                                {presaleCategories.map((item) => (
                                    <li key={item.title}>
                                        <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Footer */}
            <div className="border-t border-neutral-800">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
                            {legalLinks.map((item, index) => (
                                <div key={item.title} className="flex items-center">
                                    <Link href={item.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                        {item.title}
                                    </Link>
                                    {index < legalLinks.length - 1 && <span className="mx-2 text-neutral-700">•</span>}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-neutral-400">© {new Date().getFullYear()} CoinMews. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
