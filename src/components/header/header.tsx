import Image from "next/image";
import { Wifi, Bluetooth } from "lucide-react";

export function Header() {
	const now = new Date();
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const day = dayNames[now.getDay()];
	const month = monthNames[now.getMonth()];
	const date = now.getDate();

	const hours = now.getHours();
	const minutes = now.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes.toString().padStart(2, "0");

	return (
		<header className="horizontal items-center px-3 py-2 bg-gray-100/50 backdrop-blur text-sm justify-between">
			<div className="horizontal items-center gap-5">
				<Image src="/apple.svg" alt="Apple Logo" width={14} height={14} />
				<p className="font-semibold">Messages</p>
				<p>File</p>
				<p>Edit</p>
				<p>View</p>
				<p>Conversation</p>
				<p>Format</p>
				<p>Window</p>
				<p>Help</p>
			</div>
			<div className="horizontal items-center gap-5">
				<Bluetooth size={16} />
				<Wifi size={18} strokeWidth={3} />
				<div className="horizontal items-center gap-3">
					<p>{`${day} ${month} ${date}`}</p>
					<p>{`${formattedHours}:${formattedMinutes} ${ampm}`}</p>
				</div>
			</div>
		</header>
	);
}

export default Header;
