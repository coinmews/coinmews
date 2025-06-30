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

const guestPostFormSchema = z.object({
    title: z.string().min(5, {
        message: 'Title must be at least 5 characters.',
    }),
    content: z.string().min(100, {
        message: 'Content must be at least 100 characters.',
    }),
    excerpt: z.string().max(255).optional(),
    author_name: z.string().min(2, {
        message: 'Author name is required.',
    }),
    author_bio: z.string().min(50, {
        message: 'Author bio must be at least 50 characters.',
    }),
    reading_time: z.string().optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    banner_image: z.any().optional(),
});

type GuestPostFormValues = z.infer<typeof guestPostFormSchema>;

const defaultValues: Partial<GuestPostFormValues> = {};

export function GuestPostSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<GuestPostFormValues>({
        resolver: zodResolver(guestPostFormSchema),
        defaultValues,
    });

    function onSubmit(data: GuestPostFormValues) {
        setIsSubmitting(true);

        // Convert form data to FormData to handle file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        // Set submission type
        formData.append('submission_type', 'guest_post');

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
                <CardTitle>Submit a Guest Post</CardTitle>
                <CardDescription>Share your expertise with our community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Article Information</h3>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Article Title</FormLabel>
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
                                            <FormLabel>Article Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter the full content of your article" className="min-h-[300px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reading_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reading Time (minutes)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 5" {...field} />
                                            </FormControl>
                                            <FormDescription>Approximate time it takes to read the article</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Author Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium">Author Information</h3>

                                <FormField
                                    control={form.control}
                                    name="author_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="author_bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about yourself, your expertise, and credentials"
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
                                    name="website_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personal Website or Social Profile</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
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
                                                Upload a banner image for your article (recommended size: 1200x630px). Max 5MB.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Guest Post'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
