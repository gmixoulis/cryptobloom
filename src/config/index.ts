import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import {
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets'

export const projectId = import.meta.env.VITE_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const config = getDefaultConfig({
    appName: 'Web3 Flower Shop',
    projectId,
    chains: [sepolia],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet],
        },
    ],
    ssr: false, // Client-side only
})
