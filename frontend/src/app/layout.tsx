'use client';

import { Poppins } from 'next/font/google';
import '@src/styles/globals.css';
import Header from '@src/components/layout/Header';
import { usePathname } from 'next/navigation';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// We need to move metadata to a separate file since we're using 'use client'
// This is a limitation when mixing client and server components

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where the header should be hidden
  const noHeaderRoutes = ['/sign-in', '/login'];
  
  // Check if current path should have header hidden
  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <html lang="en" className={poppins.variable}>
      <head />
      <body className="font-poppins bg-gray-50 text-gray-900">
        {shouldShowHeader && (
          <div className='top-0'>
            <Header />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}