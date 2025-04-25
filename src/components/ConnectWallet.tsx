'use client';
import {useEffect} from "react";
import {useAccount} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {loginPost, logoutGet} from '@/controller';

export default function ConnectWallet() {
  const {address, isConnected} = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      loginPost(address);
    } else {
      logoutGet();
    }
  }, [isConnected]);

  return (
    <ConnectButton />
  )
}
