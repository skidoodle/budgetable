import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const albertSans = Albert_Sans({
	variable: "--font-albert-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Budgetable",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${albertSans.variable} ${albertSans.variable} antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
