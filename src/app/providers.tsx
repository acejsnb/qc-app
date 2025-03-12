'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {HeroUIProvider} from '@heroui/react'
import {config} from '@/config'

const queryClient = new QueryClient();

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
