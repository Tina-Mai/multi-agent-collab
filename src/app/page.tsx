import { GlobalProvider } from "@/context/globalContext";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import MessagesApp from "@/components/messages/app";

export default function Home() {
	return (
		<GlobalProvider>
			<main className="vertical h-screen bg-cover bg-center bg-no-repeat justify-between" style={{ backgroundImage: 'url("/wallpaper.png")' }}>
				<Header />
				<MessagesApp />
				<Footer />
			</main>
		</GlobalProvider>
	);
}
