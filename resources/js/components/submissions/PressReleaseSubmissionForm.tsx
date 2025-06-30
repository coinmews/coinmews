import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const pressReleaseFormSchema = z.object({
    title: z.string().min(5, {
        message: 'Title must be at least 5 characters.',
    }),
    content: z.string().min(100, {
        message: 'Content must be at least 100 characters.',
    }),
    excerpt: z.string().max(255).optional(),
    company_name: z.string().min(2, {
        message: 'Company name is required.',
    }),
    contact_email: z.string().email({
        message: 'Please provide a valid email address.',
    }),
    contact_phone: z.string().optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    banner_image: z.any().optional(),
});

type PressReleaseFormValues = z.infer<typeof pressReleaseFormSchema>;

const defaultValues: Partial<PressReleaseFormValues> = {};

export function PressReleaseSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PressReleaseFormValues>({
        resolver: zodResolver(pressReleaseFormSchema),
        defaultValues,
    });

    function onSubmit(data: PressReleaseFormValues) {
        setIsSubmitting(true);

        // Convert form data to FormData to handle file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        // Set submission type
        formData.append('submission_type', 'press_release');

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
                <CardTitle>Submit a Press Release</CardTitle>
                <CardDescription>Share your company news and announcements with our community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Press Release Information</h3>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Press Release Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a compelling title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Summary</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Provide a brief summary (max 255 characters)" {...field} />
                                            </FormControl>
                                            <FormDescription>This will be displayed in listings and search results</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Press Release Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the full content of your press release"
                                                    className="min-h-[300px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Company Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Company Information</h3>

                                <FormField
                                    control={form.control}
                                    name="company_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your company name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="contact_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contact@company.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Phone (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="website_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Website</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://company.com" {...field} />
                                            </FormControl>
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
                                    render={({ field: { onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Banner Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        onChange(file || null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload a banner image for your press release (recommended size: 1200x630px). Max 5MB.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Press Release'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
