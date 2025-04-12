'use client';

import { usePathname } from 'next/navigation';
import Header from '@src/components/layout/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Routes where the header should be hidden
  const noHeaderRoutes = ['/sign-in', '/login'];
  
  // Don't render anything if we're on a no-header route
  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }
  
  // Otherwise render the header
  return (
    <div className='top-0'>
      <Header />
    </div>
  );
}