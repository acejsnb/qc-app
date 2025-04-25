import { http } from 'wagmi'
import { createWalletClient } from 'viem'
import { sepolia } from 'wagmi/chains'
import { privateKeyToAccount } from 'viem/accounts'
import {getDefaultConfig} from "@rainbow-me/rainbowkit";

// 0xD350134bfb93d4f55c18Ca602184C0739b558AfE 的私钥 0x7b2fcce3f7bb8570f531fb9a0427f16f2ebb8302d08736c311a1fad86353c04c
export const accountPrivateKey = privateKeyToAccount('0x7b2fcce3f7bb8570f531fb9a0427f16f2ebb8302d08736c311a1fad86353c04c');
export const tokenAddress = '0xdC21d18Aa40CFAb4832105cefc8Fb8bFA9B13003';
export const mainAddress = '0xD350134bfb93d4f55c18Ca602184C0739b558AfE';

export const config = getDefaultConfig({
  appName: 'QC App',
  projectId: '202503010027AM',
  chains: [
    // mainnet
    sepolia
  ],
  transports: {
    // [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
    [sepolia.id]: http(),
  },
  ssr: true,
});

export const walletClient = createWalletClient({
  account: accountPrivateKey,
  chain: sepolia,
  transport: http(),
})
