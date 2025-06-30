import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Gold cat outline for premium look */}
            <path
                d="M 16 56 Q 8 32 24 16 Q 40 0 56 16 Q 64 32 48 48 Q 32 64 16 56 Z"
                stroke="#D4AF37"
                strokeWidth="3"
                fill="none"
            />
        </svg>
    );
}
