import { ThemeProvider } from "@/components/provider/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import QueryProvider from "@/components/provider/query.provider";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/provider/session.provider";

const spaceGrotesk = Space_Grotesk({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "Telegram Web clone",
    description: "Telegram web application clone created by AkobirCoder",
    icons: {
        icon: '/logo.svg'
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <QueryProvider>
                <html lang="en" suppressHydrationWarning>
                    <body
                        className={`${spaceGrotesk.className} antialiased`} suppressHydrationWarning
                    >
                        <ThemeProvider
                            attribute={'class'}
                            defaultTheme='system'
                            enableSystem
                            disableTransitionOnChange
                        >
                            <main>{children}</main>
                            <Toaster />
                        </ThemeProvider>
                    </body>
                </html>
            </QueryProvider>
        </SessionProvider>  
    );
}
