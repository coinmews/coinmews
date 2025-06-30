import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bell, Check, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: '/notifications',
    },
];

const notificationItems = [
    {
        id: 1,
        title: 'Your submission was approved',
        description: 'Your article "Top 5 DeFi Protocols to Watch in 2023" has been published.',
        time: '2 days ago',
        unread: true,
        type: 'submission',
    },
    {
        id: 2,
        title: 'New comment on your post',
        description: 'User JohnDoe commented: "Great analysis, I completely agree with your points."',
        time: '3 days ago',
        unread: true,
        type: 'comment',
    },
    {
        id: 3,
        title: 'Feedback on your submission',
        description: 'Your article requires some revisions before it can be published.',
        time: '1 week ago',
        unread: false,
        type: 'feedback',
    },
    {
        id: 4,
        title: 'Your article is trending',
        description: 'Your article "Bitcoin Price Analysis" has reached 1,000 views!',
        time: '2 weeks ago',
        unread: false,
        type: 'trending',
    },
    {
        id: 5,
        title: 'New follower',
        description: 'User JaneSmith started following you',
        time: '2 weeks ago',
        unread: false,
        type: 'follower',
    },
];

export default function Notifications() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="flex flex-1 flex-col gap-4 px-4 py-6 md:gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">Stay updated with your latest interactions and updates</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Check className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear all
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Notifications</CardTitle>
                        <CardDescription>View and manage your notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            <div className="space-y-4">
                                {notificationItems.map((notification) => (
                                    <div key={notification.id}>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <Bell className="text-primary h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm leading-none font-medium">{notification.title}</p>
                                                    {notification.unread && (
                                                        <Badge variant="default" className="ml-2">
                                                            New
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground text-sm">{notification.description}</p>
                                                <p className="text-muted-foreground text-xs">{notification.time}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Separator className="my-4" />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
