import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Presale } from '@/types/presaleTypes';
import { Calendar, Clock, CreditCard, Globe, Target } from 'lucide-react';

interface PresaleHeaderProps {
    presale: Presale;
}

export function PresaleHeader({ presale }: PresaleHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {/* Title and Status */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={presale.logo_url ?? undefined} alt={presale.name} />
                            <AvatarFallback>{presale.token_symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{presale.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={presale.status} />
                        <Badge variant="outline">{presale.stage}</Badge>
                    </div>
                </div>

                {/* Token Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="secondary">{presale.token_symbol}</Badge>
                    {presale.launchpad && <Badge variant="outline">{presale.launchpad}</Badge>}
                    {presale.contract_address && <code className="bg-muted rounded px-2 py-1 text-xs">{presale.contract_address}</code>}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<CreditCard className="h-5 w-5" />}
                        label="Price"
                        value={`${Number(presale.token_price).toLocaleString()} ${presale.token_price_currency}`}
                    />
                    {presale.fundraising_goal && (
                        <StatCard
                            icon={<Target className="h-5 w-5" />}
                            label="Fundraising Goal"
                            value={`$${Number(presale.fundraising_goal).toLocaleString()}`}
                        />
                    )}
                    <StatCard icon={<Calendar className="h-5 w-5" />} label="Start Date" value={new Date(presale.start_date).toLocaleDateString()} />
                    <StatCard icon={<Clock className="h-5 w-5" />} label="Remaining Time" value={presale.remaining_time} />
                </div>

                {/* Links */}
                {presale.website_url && (
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a href={presale.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {presale.website_url}
                        </a>
                    </div>
                )}

                {/* Creator Info */}
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={presale.creator.avatar_url ?? undefined} alt={presale.creator.name} />
                        <AvatarFallback>{presale.creator.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>Created by</p>
                        <p className="text-foreground font-medium">{presale.creator.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Presale['status'] }) {
    const variants: Record<Presale['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        ongoing: { variant: 'default', label: 'Ongoing' },
        upcoming: { variant: 'secondary', label: 'Upcoming' },
        ended: { variant: 'outline', label: 'Ended' },
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-card flex items-center gap-3 rounded-lg p-4">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}
