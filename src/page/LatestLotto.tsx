'use client'

import { lottoApi } from "@/app/api/lotto/route";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


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
  if (query.isLoading) return <></>
  return (
    <div className="relative border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center py-8 text-sm antialiased">
      <div className="flex justify-center mb-4 scroll-m-20 text-2xl font-bold tracking-tight text-black dark:text-white">
        [{drwNo}회] {data.drawDate} <span onClick={() => setDrwNo(drwNo - 1)}>이전</span>
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