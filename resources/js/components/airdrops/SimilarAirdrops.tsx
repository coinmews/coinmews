import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Airdrop } from '@/types/airdropTypes';
import { Link } from '@inertiajs/react';
import { Shield, Users } from 'lucide-react';

interface SimilarAirdropsProps {
    airdrops: Airdrop[];
}

export function SimilarAirdrops({ airdrops }: SimilarAirdropsProps) {
    if (airdrops.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Similar Airdrops</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {airdrops.map((airdrop) => (
                        <Link key={airdrop.id} href={`/airdrops/${airdrop.slug}`} className="block">
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Logo */}
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={airdrop.logo_image ?? undefined} alt={airdrop.token_name} />
                                            <AvatarFallback>{airdrop.token_symbol.slice(0, 2)}</AvatarFallback>
                                        </Avatar>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate font-medium">{airdrop.title}</h3>
                                                {airdrop.is_verified && <Shield className="text-primary h-4 w-4" />}
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-sm">
                                                <Badge variant="outline">{airdrop.token_symbol}</Badge>
                                                <Badge variant="secondary">{airdrop.token_network}</Badge>
                                            </div>

                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4" />
                                                <span>{airdrop.participant_count.toLocaleString()} participants</span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <StatusBadge status={airdrop.status} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: Airdrop['status'] }) {
    const variants: Record<Airdrop['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        ongoing: { variant: 'default', label: 'Ongoing' },
        upcoming: { variant: 'secondary', label: 'Upcoming' },
        potential: { variant: 'outline', label: 'Potential' },
        completed: { variant: 'default', label: 'Completed' },
        cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const { variant, label } = variants[status];

    return <Badge variant={variant}>{label}</Badge>;
}
