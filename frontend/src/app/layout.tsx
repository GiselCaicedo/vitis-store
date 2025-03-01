import { Poppins } from 'next/font/google';
import '@src/styles/globals.css';
import Header from '@src/components/layout/Header';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción de tu aplicación',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head />
      <body className="font-poppins bg-gray-50 text-gray-900">
        <div className='top-0'>
          <Header />
        </div>
        {children}
      </body>
    </html>
  );
}