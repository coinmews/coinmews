import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div>
                <AppLogoIcon className="size-10" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-lg">
                <span
                    className="mb-0.5 truncate leading-none font-bold text-[#222]"
                    style={{ fontFamily: 'Satoshi, Arial, sans-serif' }}
                >
                    CoinMews
                </span>
            </div>
        </>
    );
}
