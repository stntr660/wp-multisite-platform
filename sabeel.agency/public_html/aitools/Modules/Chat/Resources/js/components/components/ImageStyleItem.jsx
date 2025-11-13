import useLangTranslation from "../hooks/useLangTranslation";
import { CheckmarkIcon } from "./icons";

const ImageStyleItem = ({ title, avatar, isPremium, isChecked }) => {
	const { trans } = useLangTranslation();
	return (
		<div className="relative group/item h-[92px] max-w-[164px] w-full rounded-md overflow-hidden">
			<img
				src={avatar}
				alt={title}
				className="w-full h-full object-cover group-hover/item:scale-125 transition-all duration-300 ease-in-out"
			/>
			<div className="h-10 imageStyleGradient w-full absolute bottom-0 text-xs text-white font-medium">
				<p className="ml-2.5 absolute bottom-1.5">{title}</p>
			</div>
			{isPremium && (
				<p className="absolute bg-gold top-2.5 right-2.5 py-1 px-1.5 text-3xs font-medium rounded-xl text-dark-1">
					{trans("Pro")}
				</p>
			)}
			{isChecked && (
				<div className="absolute top-2 right-2">
					<CheckmarkIcon />
				</div>
			)}
			{isChecked && (
				<div className="absolute transform -translate-y-full h-full w-full overflow-hidden gradient-border"></div>
			)}
		</div>
	);
};

export default ImageStyleItem;