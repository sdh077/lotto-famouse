'use client'

import records from '@/lib/data/lotto-record.json';
import location from '@/lib/data/location.json';
import { Button } from "@/components/ui/button";
import { useFilterStore } from '@/stores/filter-store-provider';
import { useState } from 'react';
import { Card, ExpandableCard } from '@/widget/expandable-card';
import { ClientPagination } from '@/widget/Pagination';

export default function Home() {

  return (
    <div className="relative grid grid-cols-2 gap-4 container pt-8 h-full">
      <Location />
      <BestShop />
    </div>
  );
}
function Location() {
  const { address1, address2, setAddress } = useFilterStore((state) => state)
  const select = location.find(local => local.name === address1) ?? location[0]
  return (
    <div className='sticky top-16 w-full h-fit'>
      <div className='flex gap-2 flex-wrap w-full mb-4'>
        {location.map(local =>
          <div key={local.fullname}>
            <Button variant={local.name === address1 ? 'default' : 'outline'} onClick={() => setAddress(local.name === address1 ? '' : local.name, '')}>{local.name}</Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1 my-2">
        {select.sub.map(item =>
          <Button
            onClick={() => setAddress(select.name, item === address2 ? '' : item)}
            variant={item === address2 ? 'default' : 'outline'} key={item}>{item}</Button>
        )}
      </div>
    </div>
  )
}

function BestShop() {
  const [pageNo, setPageNo] = useState(1)
  const { address1, address2 } = useFilterStore((state) => state)
  const shops = Object.entries(records).sort(([, a], [, b]) => b.items.length - a.items.length)
    .filter(([, shop]) => shop.location.startsWith(`${address1} ${address2}`))
  const cards: Card[] = shops.map(([key, shop]) => ({
    id: key,
    description: shop.location,
    title: shop.name,
    items: shop.items,
    ctaText: '지도보기',
    ctaLink: `https://dhlottery.co.kr/store.do?method=topStoreLocation&gbn=lotto&rtlrId=${key}`,
  })).slice((pageNo - 1) * 12, pageNo * 12)
  return (
    <div>
      <ExpandableCard cards={cards} />
      <ClientPagination total={cards.length} pageNo={pageNo} setPageNo={setPageNo} />
    </div>
  )
}


