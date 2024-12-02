import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function Home() {
	return (
		<main className="vertical min-h-screen bg-cover bg-center bg-no-repeat justify-between" style={{ backgroundImage: 'url("/wallpaper.png")' }}>
			<Header />
			<Footer />
		</main>
	);
}
