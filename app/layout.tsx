import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bebas_Neue } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const bebas = Bebas_Neue({
    weight: '400',
    variable: '--font-bebas-neue',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Swanwoo Pedals',
    description: 'DIY Effects Pedals, Custom Illustrating and Hand-Wiring',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${bebas.variable} antialiased`}>{children}</body>
        </html>
    );
}