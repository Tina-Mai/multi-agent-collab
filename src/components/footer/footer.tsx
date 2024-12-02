import Image from "next/image";

const Footer = () => {
	return (
		<footer className="horizontal w-fit self-center items-center py-2 px-3 bg-gray-100/35 backdrop-blur-lg rounded-[20px] shadow-lg border border-white/25 mb-2 gap-3">
			<Image src="/apps/mail.svg" alt="Mail App" width={55} height={55} />
			<div className="relative">
				<Image src="/apps/messages.svg" alt="Messages App" width={55} height={55} />
				<div className="absolute left-1/2 -bottom-2 size-1 bg-gray-900 rounded-full -translate-x-1/2" />
			</div>
			<Image src="/apps/preview.png" alt="Preview App" width={55} height={55} className="mt-1" />
			<div className="h-14 w-px bg-black/50 -my-10 mx-2" />
			<Image src="/apps/trash.png" alt="Trash App" width={55} height={55} />
		</footer>
	);
};

export default Footer;
