'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const { connectors } = getDefaultWallets({
    appName: 'Voting DApp',
    projectId: API_KEY!
});

const config = createConfig({
    chains: [sepolia],
    connectors,
    transports: {
        [sepolia.id]: http(),
    },
    ssr: true,
});

const queryClient = new QueryClient();

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
