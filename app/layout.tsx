import {
    ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import {ToastProvider} from "@/components/providers/toaster-provider";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="ua">
                <body>
                    <ToastProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}