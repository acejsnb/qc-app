'use client';
import {Button} from "@heroui/react";
import {useAccount, useWalletClient, useWriteContract} from "wagmi";
import {parseEther} from "viem";
import {accountPrivateKey, tokenAddress, mainAddress, walletClient as walletClientAccount} from "@/config";
import QCToken from "@/token/QCToken.json";
import Account from "@/app/components/Account";

interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  image?: string
}

export default function Receive() {
  const { data: walletClient } = useWalletClient();
  const {address} = useAccount();
  const {data: hash, isSuccess, isPending, writeContract} = useWriteContract();
  const receiveHandle = async () => {
    if (!address) return;
    writeContract({
      address: mainAddress,
      abi: QCToken.abi,
      functionName: 'transfer',
      args: [address, parseEther('100')]
    });
    console.log(2222,hash);
  }

  const addToken = async (tokenInfo: TokenInfo) => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected')
      }

      // 调用 MetaMask 的 wallet_watchAsset 方法添加代币
      await walletClient.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            image: tokenInfo.image
          },
        },
      })

      console.log('Token added successfully')
    } catch (error) {
      console.error('Failed to add token:', error)
    }
  };
  const addTokenHandle = () => {
    addToken({
      address: tokenAddress,
      symbol: 'QC',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/thumbs/pancakeswap.png?v=040'
    })
  };
  return (
    <div className="flex items-center justify-center flex-col gap-3 p-10">
      <Account />
      <Button onPress={receiveHandle}>Mint</Button>
      <Button color="secondary" onPress={addTokenHandle}>Add QC to your wallet</Button>
    </div>
  )
}
