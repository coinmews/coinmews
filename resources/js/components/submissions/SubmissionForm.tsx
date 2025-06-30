import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Coins, FileText, Loader2, Megaphone, Newspaper, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AirdropSubmissionForm } from './AirdropSubmissionForm';
import { EventSubmissionForm } from './EventSubmissionForm';
import { GuestPostSubmissionForm } from './GuestPostSubmissionForm';
import { PresaleSubmissionForm } from './PresaleSubmissionForm';
import { PressReleaseSubmissionForm } from './PressReleaseSubmissionForm';
import { SponsoredContentSubmissionForm } from './SponsoredContentSubmissionForm';
import { SubmissionTypeSelect } from './SubmissionTypeSelect';

type SubmissionTypeInfo = {
    label: string;
    description: string;
    icon: React.ReactNode;
};

export function SubmissionForm() {
    const [submissionType, setSubmissionType] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const submissionTypes: Record<string, SubmissionTypeInfo> = {
        presale: {
            label: 'Presale / ICO / IDO / IEO',
            description: 'Submit details about an upcoming token sale or fundraising event',
            icon: <Coins className="h-5 w-5" />,
        },
        airdrop: {
            label: 'Airdrop',
            description: 'Share details about a token or NFT giveaway',
            icon: <Sparkles className="h-5 w-5" />,
        },
        event: {
            label: 'Event',
            description: 'List a conference, meetup, or online event',
            icon: <CalendarDays className="h-5 w-5" />,
        },
        press_release: {
            label: 'Press Release',
            description: 'Announce news or updates about your company',
            icon: <Newspaper className="h-5 w-5" />,
        },
        guest_post: {
            label: 'Guest Post',
            description: 'Submit an article or blog post for publication',
            icon: <FileText className="h-5 w-5" />,
        },
        sponsored_content: {
            label: 'Sponsored Content',
            description: 'Promote your project with sponsored articles',
            icon: <Megaphone className="h-5 w-5" />,
        },
    };

    const handleTypeChange = (type: string | undefined) => {
        if (type !== submissionType) {
            setIsLoading(true);
            // Reset form and change type
            setSubmissionType(type);
            // Simulate loading for better UX on form change
            setTimeout(() => setIsLoading(false), 300);
        }
    };

    const renderFormComponent = () => {
        switch (submissionType) {
            case 'presale':
                return <PresaleSubmissionForm />;
            case 'airdrop':
                return <AirdropSubmissionForm />;
            case 'event':
                return <EventSubmissionForm />;
            case 'press_release':
                return <PressReleaseSubmissionForm />;
            case 'guest_post':
                return <GuestPostSubmissionForm />;
            case 'sponsored_content':
                return <SponsoredContentSubmissionForm />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <div className="border-b pb-4">
                <h2 className="mb-2 text-xl font-semibold">What would you like to submit?</h2>
                <p className="text-muted-foreground">Select the type of content you would like to submit to our platform</p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
                <SubmissionTypeSelect value={submissionType} onTypeSelected={handleTypeChange} />

                {submissionType && (
                    <div className="text-primary mt-4 flex items-center gap-2 text-sm">
                        {submissionTypes[submissionType]?.icon}
                        <span>
                            You are submitting a <strong>{submissionTypes[submissionType]?.label}</strong>
                        </span>
                        <button
                            onClick={() => handleTypeChange(undefined)}
                            className="text-muted-foreground hover:text-primary ml-auto text-xs hover:underline"
                        >
                            Change type
                        </button>
                    </div>
                )}

                {!submissionType && (
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(submissionTypes).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => handleTypeChange(key)}
                                className="border-border/50 hover:border-primary hover:bg-primary/5 flex flex-col items-start gap-1 rounded-md border p-3 transition-colors"
                            >
                                <div className="text-primary flex items-center gap-2 font-medium">
                                    {info.icon}
                                    <span>{info.label}</span>
                                </div>
                                <p className="text-muted-foreground text-left text-xs">{info.description}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {submissionType && !isLoading && (
                    <motion.div
                        key={submissionType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg border bg-white"
                    >
                        <div className="bg-muted/30 border-b p-4">
                            <h3 className="flex items-center gap-2 font-medium">
                                {submissionTypes[submissionType]?.icon}
                                {submissionTypes[submissionType]?.label} Submission Form
                            </h3>
                            <p className="text-muted-foreground mt-1 text-sm">{submissionTypes[submissionType]?.description}</p>
                        </div>
                        <div className="p-4">{renderFormComponent()}</div>
                    </motion.div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
