import Image from "next/image";

const Footer = () => {
	return (
		<footer className="horizontal w-fit self-center items-center p-2.5 bg-gray-100/35 backdrop-blur-lg rounded-[20px] shadow-lg border border-white/25 mb-2 gap-3">
			<Image src="/apps/mail.svg" alt="Mail App" width={55} height={55} />
			<div className="relative">
				<Image src="/apps/messages.svg" alt="Messages App" width={55} height={55} />
				<div className="absolute left-1/2 -bottom-2 size-1 bg-gray-900 rounded-full -translate-x-1/2" />
			</div>
		</footer>
	);
};

export default Footer;
