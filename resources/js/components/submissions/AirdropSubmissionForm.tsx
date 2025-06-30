import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileInput } from '@/components/ui/file-input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const airdropFormSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters.',
    }),
    description: z.string().min(50, {
        message: 'Description must be at least 50 characters.',
    }),
    token_symbol: z.string().min(1, {
        message: 'Token symbol is required.',
    }),
    type: z.enum(['token', 'nft', 'other']),
    blockchain: z.string().optional(),
    total_supply: z.string().optional(),
    airdrop_qty: z.string().optional(),
    winners_count: z.string().optional(),
    usd_value: z.string().optional(),
    tasks_count: z.string().optional(),
    start_date: z.date({
        required_error: 'Please select a start date.',
    }),
    end_date: z.date({
        required_error: 'Please select an end date.',
    }),
    logo_image: z.any().optional(),
});

type AirdropFormValues = z.infer<typeof airdropFormSchema>;

const defaultValues: Partial<AirdropFormValues> = {
    type: 'token',
};

export function AirdropSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AirdropFormValues>({
        resolver: zodResolver(airdropFormSchema),
        defaultValues,
    });

    function onSubmit(data: AirdropFormValues) {
        setIsSubmitting(true);

        // Convert form data to FormData to handle file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value !== undefined) {
                formData.append(key, value);
            }
        });

        // Set submission type
        formData.append('submission_type', 'airdrop');

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
                <CardTitle>Submit an Airdrop</CardTitle>
                <CardDescription>Share details about your upcoming token airdrop with our community.</CardDescription>
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Airdrop Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Airdrop name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="token_symbol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Token Symbol</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. BTC, ETH" {...field} />
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
                                            <FormLabel>Airdrop Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your airdrop, project, and eligibility requirements"
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Airdrop Details */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Airdrop Details</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="token">Token</SelectItem>
                                                        <SelectItem value="nft">NFT</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="blockchain"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Blockchain</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Ethereum, Solana" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="total_supply"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Supply</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g. 1000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="airdrop_qty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Airdrop Quantity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g. 100000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="winners_count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Winners</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g. 1000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="usd_value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>USD Value</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g. 10000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="tasks_count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Tasks</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g. 5" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
                            </div>

                            {/* Media */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Media</h3>

                                <FormField
                                    control={form.control}
                                    name="logo_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logo Image</FormLabel>
                                            <FormControl>
                                                <FileInput accept="image/*" onFileChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription>Upload a square logo image (1:1 aspect ratio). Max 2MB.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Airdrop'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
