'use client'

import records from '@public/file.json';
import { useFilterStore } from '@/stores/filter-store-provider';
import { useEffect, useState } from 'react';
import { Card, ExpandableCard } from '@/widget/expandable-card';
import { ClientPagination } from '@/widget/Pagination';

export default function BestShop() {
  const [pageNo, setPageNo] = useState(1)
  const { address1, address2 } = useFilterStore((state) => state)
  const shops = Object.entries(records).sort(([, a], [, b]) => b.items.length - a.items.length)
    .filter(([, shop]) => shop.location.startsWith(`${address1} ${address2}`))
  const cards: Card[] = shops.map(([key, shop]) => ({
    id: `${address1}-${address2}-${key}`,
    description: shop.location,
    title: shop.name,
    items: shop.items,
    ctaText: '지도보기',
    ctaLink: `https://dhlottery.co.kr/store.do?method=topStoreLocation&gbn=lotto&rtlrId=${key}`,
  })).slice((pageNo - 1) * 12, pageNo * 12)
  useEffect(() => {
    setPageNo(1)
  }, [address1, address2])
  return (
    <div>
      <ExpandableCard cards={cards} />
      <ClientPagination total={cards.length} pageNo={pageNo} setPageNo={setPageNo} />
    </div>
  )
}


