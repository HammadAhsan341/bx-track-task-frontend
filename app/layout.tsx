import './globals.css';
import { PropsWithChildren } from 'react';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Multi-Tenant CRM',
  description: 'Assignment implementation',
};

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
