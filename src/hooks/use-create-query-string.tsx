'use client'
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCreateQueryString = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value);
      return `${pathname}?${params.toString()}`;
    },
    [searchParams]
  );

  return createQueryString;
};
