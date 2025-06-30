import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubmissionTypeSelectProps {
    onTypeSelected: (type: string) => void;
    value?: string;
}

export function SubmissionTypeSelect({ onTypeSelected, value }: SubmissionTypeSelectProps) {
    return (
        <Select value={value} onValueChange={onTypeSelected}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select submission type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="presale">Presale/ICO/IDO/IEO</SelectItem>
                <SelectItem value="airdrop">Airdrop</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="press_release">Press Release</SelectItem>
                <SelectItem value="guest_post">Guest Post</SelectItem>
                <SelectItem value="sponsored_content">Sponsored Content</SelectItem>
            </SelectContent>
        </Select>
    );
}
