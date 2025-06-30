import React from 'react';

const CryptoPriceTicker: React.FC = () => {
    return (
        <div className="overflow-hidden bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="flex items-center justify-center">
                    <gecko-coin-price-marquee-widget
                        locale="en"
                        dark-mode="true"
                        transparent-background="true"
                        coin-ids=""
                        initial-currency="usd"
                    ></gecko-coin-price-marquee-widget>
                </div>
            </div>
        </div>
    );
};

export default CryptoPriceTicker;
