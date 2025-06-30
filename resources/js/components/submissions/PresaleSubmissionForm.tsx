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

const presaleFormSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters.',
    }),
    description: z.string().min(50, {
        message: 'Description must be at least 50 characters.',
    }),
    token_symbol: z.string().min(1, {
        message: 'Token symbol is required.',
    }),
    stage: z.enum(['ICO', 'IDO', 'IEO', 'Presale', 'Privatesale']),
    launchpad: z.string().optional(),
    start_date: z.date({
        required_error: 'Please select a start date.',
    }),
    end_date: z.date({
        required_error: 'Please select an end date.',
    }),
    token_price: z.string().min(1, {
        message: 'Token price is required.',
    }),
    token_price_currency: z.string().min(1, {
        message: 'Currency is required.',
    }),
    total_supply: z.string().optional(),
    tokens_for_sale: z.string().optional(),
    percentage_of_supply: z.string().optional(),
    soft_cap: z.string().optional(),
    hard_cap: z.string().optional(),
    fundraising_goal: z.string().optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    whitepaper_url: z.string().url().optional().or(z.literal('')),
    contract_address: z.string().optional(),
    logo_image: z.any().optional(),
});

type PresaleFormValues = z.infer<typeof presaleFormSchema>;

const defaultValues: Partial<PresaleFormValues> = {
    stage: 'ICO',
    token_price_currency: 'USDT',
};

export function PresaleSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PresaleFormValues>({
        resolver: zodResolver(presaleFormSchema),
        defaultValues,
    });

    function onSubmit(data: PresaleFormValues) {
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
                <CardTitle>Submit a Presale</CardTitle>
                <CardDescription>Share details about your upcoming token presale with our community.</CardDescription>
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
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Project name" {...field} />
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
                                            <FormLabel>Project Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your project, goals, and use cases"
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Presale Details */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Presale Details</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="stage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stage</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select stage" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ICO">ICO</SelectItem>
                                                        <SelectItem value="IDO">IDO</SelectItem>
                                                        <SelectItem value="IEO">IEO</SelectItem>
                                                        <SelectItem value="Presale">Presale</SelectItem>
                                                        <SelectItem value="Privatesale">Privatesale</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="launchpad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Launchpad (optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. PinkSale, DxSale" {...field} />
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
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !field.value && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !field.value && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="token_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Token Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="token_price_currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Currency</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select currency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="USDT">USDT</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="ETH">ETH</SelectItem>
                                                        <SelectItem value="BNB">BNB</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Token Economics */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Token Economics (Optional)</h3>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="total_supply"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Supply</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 1000000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tokens_for_sale"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tokens for Sale</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 500000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="percentage_of_supply"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>% of Supply</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="e.g. 50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="soft_cap"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Soft Cap</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 50000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hard_cap"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hard Cap</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 100000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fundraising_goal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fundraising Goal (USD)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 2000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Links and Resources */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Links and Resources</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="website_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://your-project.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="whitepaper_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Whitepaper URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://your-project.com/whitepaper.pdf" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="contract_address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contract Address (if available)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0x..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Logo */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Project Logo</h3>

                                <FormField
                                    control={form.control}
                                    name="logo_image"
                                    render={({ field: { onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Logo Image</FormLabel>
                                            <FormControl>
                                                <FileInput accept="image/*" onFileChange={onChange} showPreview={true} />
                                            </FormControl>
                                            <FormDescription>Upload a square logo image (recommended size: 512x512px)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Presale'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
