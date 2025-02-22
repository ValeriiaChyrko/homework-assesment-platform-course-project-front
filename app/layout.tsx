import {
    ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import {ToastProvider} from "@/components/providers/toaster-provider";
import {ConfettiProvider} from "@/components/providers/confetti-provider";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="ua">
                <body>
                    <ConfettiProvider />
                    <ToastProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}