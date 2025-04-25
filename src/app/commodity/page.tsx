'use client';
import {useEffect, useState} from "react";
import {Card, CardFooter, Button} from '@heroui/react';
import {getCommodityList} from "@/controller";
import type {CommodityItem} from "@/db/commodity";
import clsx from "clsx";
import {useAccount, useWriteContract} from "wagmi";
import {parseEther} from "viem";
import {tokenAddress, mainAddress} from "@/config";
import QCToken from "@/token/QCToken.json";

const colors = ['bg-cyan-500', 'bg-emerald-500', 'bg-lime-500', 'bg-sky-500']

export default function Commodity() {
  const {address} = useAccount();
  const [data, setData] = useState<CommodityItem[]>([]);
  const getCommodityData = async () => {
    const data = await getCommodityList();
    setData(data.data);
  }

  useEffect(() => {
    getCommodityData()
  }, []);

  const {data: hash, isSuccess, isPending, writeContract} = useWriteContract();
  const handleBuy = (item: CommodityItem) => {
    console.log(item);
    writeContract({
      address: tokenAddress,
      abi: QCToken.abi,
      functionName: 'transfer',
      args: [mainAddress, parseEther(String(item.price))]
    });
  }

  return (
    <div className="flex flex-wrap gap-3 px-10 py-5">
      {data.map(((item, i) => (
        <Card
          isFooterBlurred
          className="border-none w-[200px] h-[200px]"
          radius="lg"
        >
          <div className={clsx(
            'flex flex-col gap-1 items-center justify-center w-full h-full',
            colors[i % 4]
          )}>
            <section className="text-medium">{item.name}</section>
            <section className="text-xs">{item.desc}</section>
          </div>
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{item.symbol} {item.price}</p>
            <Button
              className="text-tiny text-white bg-black/20"
              color="default"
              radius="lg"
              size="sm"
              variant="flat"
              onPress={() => handleBuy(item)}
            >
              Buy now
            </Button>
          </CardFooter>
        </Card>
      )))}
    </div>
  )
}
