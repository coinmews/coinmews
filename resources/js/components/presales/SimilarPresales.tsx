import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Presale } from '@/types/presaleTypes';
import { Link } from '@inertiajs/react';
import { Shield, Target } from 'lucide-react';

interface SimilarPresalesProps {
    presales: Presale[];
}

export function SimilarPresales({ presales }: SimilarPresalesProps) {
    if (presales.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Similar Presales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {presales.map((presale) => (
                        <Link key={presale.id} href={`/presales/${presale.slug}`} className="block">
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Logo */}
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={presale.logo_image ?? undefined} alt={presale.token_name} />
                                            <AvatarFallback>{presale.token_symbol.slice(0, 2)}</AvatarFallback>
                                        </Avatar>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate font-medium">{presale.title}</h3>
                                                {presale.requires_kyc && <Shield className="text-primary h-4 w-4" />}
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-sm">
                                                <Badge variant="outline">{presale.token_symbol}</Badge>
                                                <Badge variant="secondary">{presale.token_network}</Badge>
                                            </div>

                                            {presale.status === 'active' && (
                                                <div className="space-y-1">
                                                    <Progress value={presale.progress} className="h-1" />
                                                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                                                        <span>
                                                            {Number(presale.total_raised).toLocaleString()} {presale.token_symbol}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Target className="h-3 w-3" />
                                                            {Number(presale.hard_cap).toLocaleString()} {presale.token_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <StatusBadge status={presale.status} />
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

function StatusBadge({ status }: { status: Presale['status'] }) {
    const variants: Record<Presale['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        active: { variant: 'default', label: 'Active' },
        upcoming: { variant: 'secondary', label: 'Upcoming' },
        completed: { variant: 'outline', label: 'Completed' },
        cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
}
