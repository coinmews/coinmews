import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileInput } from '@/components/ui/file-input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const eventFormSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be at least 3 characters.',
    }),
    description: z.string().min(50, {
        message: 'Description must be at least 50 characters.',
    }),
    type: z.enum(['crypto_event', 'web3_event', 'community_event', 'ai_event']),
    start_date: z.date({
        required_error: 'Please select a start date.',
    }),
    end_date: z.date({
        required_error: 'Please select an end date.',
    }),
    location: z.string().optional(),
    is_virtual: z.boolean().default(false),
    virtual_link: z.string().url().optional().or(z.literal('')),
    registration_link: z.string().url().optional().or(z.literal('')),
    max_participants: z.string().optional(),
    banner_image: z.any().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultValues: Partial<EventFormValues> = {
    type: 'crypto_event',
    is_virtual: false,
};

export function EventSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues,
    });

    const watchIsVirtual = form.watch('is_virtual');

    function onSubmit(data: EventFormValues) {
        setIsSubmitting(true);

        // Convert form data to FormData to handle file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== undefined) {
                formData.append(key, value);
            }
        });

        // Set submission type
        formData.append('submission_type', 'event');

        router.post(route('submissions.store'), formData, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Submit an Event</CardTitle>
                <CardDescription>Share details about your upcoming event with our community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Basic Information</h3>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Event title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your event, speakers, and what attendees can expect"
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select event type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="crypto_event">Crypto Event</SelectItem>
                                                    <SelectItem value="web3_event">Web3 Event</SelectItem>
                                                    <SelectItem value="community_event">Community Event</SelectItem>
                                                    <SelectItem value="ai_event">AI Event</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Event Details */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Event Details</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="end_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date() ||
                                                                (form.getValues().start_date && date < form.getValues().start_date)
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="is_virtual"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Virtual Event</FormLabel>
                                                <FormDescription>Is this event taking place online?</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {watchIsVirtual ? (
                                    <FormField
                                        control={form.control}
                                        name="virtual_link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Virtual Event Link</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormDescription>Link to the virtual event platform (Zoom, Google Meet, etc.)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Event location" {...field} />
                                                </FormControl>
                                                <FormDescription>Physical address or venue name</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="registration_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormDescription>Link for attendees to register or sign up for the event</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="max_participants"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Maximum Participants</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 100" {...field} />
                                            </FormControl>
                                            <FormDescription>Maximum number of attendees (leave empty if unlimited)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Media */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Media</h3>

                                <FormField
                                    control={form.control}
                                    name="banner_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Banner Image</FormLabel>
                                            <FormControl>
                                                <FileInput accept="image/*" onFileChange={field.onChange} showPreview={true} />
                                            </FormControl>
                                            <FormDescription>
                                                Upload a banner image for your event (recommended size: 1200x630px). Max 5MB.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Event'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
