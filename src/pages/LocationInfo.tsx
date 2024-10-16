'use client'

import location from '@/lib/data/location.json';
import { Button } from "@/components/ui/button";
import { useFilterStore } from '@/stores/filter-store-provider';

export default function LocationInfo() {
  const { address1, address2, setAddress } = useFilterStore((state) => state)
  const select = location.find(local => local.name === address1) ?? location[0]
  return (
    <div className='sticky top-24 w-full h-fit'>
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
