import "./globals.css";

import Player from "@/components/Player";
import SideBar from "@/components/SideBar";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import SupabaseProvider from "@/providers/SupabaseProvider";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";

import type { Metadata } from "next";
import Head from "next/head";
import { Figtree } from "next/font/google";

export const revalidate = 0;

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Spotify Clone",
	description: "Listen to music for free!",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const userSongs = await getSongsByUserId();
	const products = await getActiveProductsWithPrices();

	return (
		<html lang="en">
			<Head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</Head>
			<body suppressHydrationWarning className={font.className}>
				<ToasterProvider />
				<SupabaseProvider>
					<UserProvider>
						<ModalProvider products={products} />
						<SideBar songs={userSongs}>{children}</SideBar>
						<Player />
					</UserProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
