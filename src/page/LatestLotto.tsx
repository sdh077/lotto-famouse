'use client'

import { lottoApi } from "@/app/api/lotto/route";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";


export function SkeletonView() {
  return (
    <div className="flex items-center space-x-4 h-40">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default function LatestLotto({ latestNo }: { latestNo: number }) {
  const [drwNo, setDrwNo] = useState(latestNo)
  const query = useQuery({
    queryKey: ['latest', drwNo], queryFn: async () =>
      fetch(`/api/lotto?drwNo=${drwNo}`).then(res => res.json())
  })
  const data: lottoApi = query.data
  const containerStyles = "flex gap-6"
  const iconStyles = "w-12 h-12 p-2 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
  const addStyles = "w-12 h-12 p-2 rounded-full flex justify-center items-center text-accent text-base "
  if (query.isLoading) return <SkeletonView />
  return (
    <div className="relative border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center py-8 text-sm antialiased">
      <div className="flex justify-center items-center mb-4 scroll-m-20 text-2xl font-bold tracking-tight text-black dark:text-white">
        <span onClick={() => setDrwNo(drwNo - 1)}><BiCaretLeft className="text-2xl" /></span>
        [{drwNo}회]
        {data.drawDate} {drwNo < latestNo && <span onClick={() => setDrwNo(drwNo + 1)}><BiCaretRight className="text-2xl" /></span>}
      </div>
      <div className="relative grid grid-cols-8">
        {data.winningNumbers.map(winningNumber =>
          <div className={containerStyles} key={winningNumber}>
            <div className={iconStyles}>
              {winningNumber}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <div className={containerStyles}>
            <div className={addStyles}>
              <PlusIcon />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className={containerStyles}>
            <div className={iconStyles}>
              {data.bonusNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}