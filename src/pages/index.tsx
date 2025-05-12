import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
    return (
        <main style={{ padding: '2rem' }}>
            <h1>🗳️ Voting DApp</h1>
            <ConnectButton />
        </main>
    );
}