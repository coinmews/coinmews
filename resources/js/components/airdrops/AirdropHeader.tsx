import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Airdrop } from '@/types/airdropTypes';
import { formatDistanceToNow } from 'date-fns';
import { Award, CalendarDays, Clock, Shield, Users } from 'lucide-react';
import React from 'react';

interface AirdropHeaderProps {
    airdrop: Airdrop;
}

export function AirdropHeader({ airdrop }: AirdropHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Logo and Header */}
            <div className="space-y-4">
                {/* Title and Status */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="border-primary/10 h-12 w-12 rounded-full border-2">
                            <AvatarImage src={airdrop.logo_url ?? undefined} alt={airdrop.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">{airdrop.token_symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{airdrop.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={airdrop.status} />
                        {airdrop.is_featured && (
                            <Badge className="flex items-center gap-1 bg-red-100 text-red-800">
                                <Shield className="h-4 w-4" />
                                Featured
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Token Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{airdrop.name}</span>
                        <Badge variant="outline">{airdrop.token_symbol}</Badge>
                    </div>
                    <Badge variant="secondary">{airdrop.blockchain}</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Duration" value={airdrop.time_remaining} />
                    <StatCard
                        icon={<Clock className="h-5 w-5" />}
                        label="Start Date"
                        value={formatDistanceToNow(new Date(airdrop.start_date), { addSuffix: true })}
                    />
                    <StatCard icon={<Users className="h-5 w-5" />} label="Winners" value={airdrop.winners_count?.toLocaleString() ?? 'TBA'} />
                    <StatCard
                        icon={<Award className="h-5 w-5" />}
                        label="Airdrop Quantity"
                        value={airdrop.airdrop_qty ? Number(airdrop.airdrop_qty).toLocaleString() : 'TBA'}
                    />
                </div>

                {/* Creator Info */}
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={airdrop.creator.avatar ?? undefined} alt={airdrop.creator.name} />
                        <AvatarFallback>{airdrop.creator.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>Created by</p>
                        <p className="text-foreground font-medium">{airdrop.creator.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Airdrop['status'] }) {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        ongoing: { variant: 'default', label: 'Ongoing' },
        upcoming: { variant: 'secondary', label: 'Upcoming' },
        potential: { variant: 'outline', label: 'Potential' },
        completed: { variant: 'default', label: 'Completed' },
        cancelled: { variant: 'destructive', label: 'Cancelled' },
        ended: { variant: 'destructive', label: 'Ended' },
    };

    // Fallback for unknown status
    if (!variants[status]) {
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }

    const { variant, label } = variants[status];

    return <Badge variant={variant}>{label}</Badge>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
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
