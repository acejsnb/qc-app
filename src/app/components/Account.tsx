'use client'
// import Image from "next/image";
import {useState, ChangeEvent} from "react";
import {Button, Input} from '@heroui/react'
import {useAccount, useBalance, useReadContract, useWriteContract, useWalletClient} from 'wagmi'
import {parseEther, formatEther} from "viem";
import {PublicKey} from '@solana/web3.js'
import {tokenAddress} from '@/config'
import QCToken from '@/token/QCToken.json'

interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  image?: string
}

export default function Account() {
  const account = useAccount();
  console.log(1212,account);
  const balance = useBalance({
    address: account.address,
    token: tokenAddress
  });
  const {data: name = ''} = useReadContract({
    abi: QCToken.abi,
    address: tokenAddress,
    functionName: 'name'
  });
  const {data: symbol = ''} = useReadContract({
    abi: QCToken.abi,
    address: tokenAddress,
    functionName: 'symbol'
  });
  const {data: totalSupplyVal = 0} = useReadContract({
    abi: QCToken.abi,
    address: tokenAddress,
    functionName: 'totalSupply'
  });
  const {data: balanceOf = 0} = useReadContract({
    abi: QCToken.abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account.address]
  });
  // console.log(111,balance);
  // 0xEa2d9d1a0F46660a2cFB81A60E2db8619D3576Cc
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const toAddressHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.target.value);
  }
  const amountHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }
  const {data: hash, isSuccess, isPending, writeContract} = useWriteContract();
  const sendHandle = async () => {
    if (!toAddress || !amount) return;
    writeContract({
      address: tokenAddress,
      abi: QCToken.abi,
      functionName: 'transfer',
      args: [toAddress, parseEther(amount)]
    });
    console.log(2222,hash);
  }

  const { data: walletClient } = useWalletClient();
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

  const addTokenToPhantom = async (tokenAddress: string) => {
    try {
      // 检查是否安装了 Phantom 钱包
      const provider = (window as any).solana;
      if (!provider || !provider.isPhantom) {
        throw new Error('请先安装 Phantom 钱包');
      }

      // 创建代币的 mint 地址
      const tokenMint = new PublicKey(tokenAddress);

      // 调用 Phantom 钱包的 addToken 方法
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'SPL', // Solana 代币类型
          options: {
            mint: tokenMint.toString(), // 代币的 mint 地址
          },
        },
      });

      return true;
    } catch (error) {
      console.error('添加代币失败:', error);
      throw error;
    }
  };

  const addTokenPhantom = () => {
    addTokenToPhantom(tokenAddress)
  }

  return (
    <div className="w-full mt-5">
      <section>
        <span>address: </span>
        <span>{account.address}</span>
      </section>
      <section>
        <span>chain: </span>
        <span>{account.chain?.name}</span>
      </section>
      <section>
        <span>connector: </span>
        <span>
          {/*{account.connector?.icon && <Image src={account.connector?.icon} alt=""/>}*/}
          {account.connector?.name}
        </span>
      </section>
      <section>
        <span>name: </span>
        <span>{name as string}</span>
      </section>
      <section>
        <span>symbol: </span>
        <span>{symbol as string}</span>
      </section>
      <section>
        <span>totalSupply: </span>
        <span>{formatEther(totalSupplyVal as bigint)}</span>
      </section>
      <section>
        <span>balanceOf: </span>
        <span>{formatEther(balanceOf as bigint)}</span>
      </section>
      <section>
        <span>balance: </span>
        <span>{balance.data ? formatEther(balance.data.value) : 0} {balance.data?.symbol}</span>
      </section>
      <section>
        <Button className="px-2 bg-gray-500 text-white" onPress={addTokenHandle}>添加 QC 到钱包</Button>
      </section>
      <section>
        <Input type="text" placeholder="address" value={toAddress} onChange={toAddressHandle}/>
        <br/>
        <Input type="text" placeholder="amount" value={amount} onChange={amountHandle}/>
        <span>QC</span>
        <br/>
        <Button className="px-2 bg-gray-500 text-white" disabled={isPending} onPress={sendHandle}>{isPending?'pending...':'发送'}</Button>
        <p>{hash}</p>
      </section>
    </div>
  );
}
