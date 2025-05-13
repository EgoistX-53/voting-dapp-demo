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

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    ...getDefaultWallets({
        appName: 'Voting DApp',
        projectId: 'YOUR_PROJECT_ID',
    }),
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
