
import cn from "../utils/cn";
import { DocumentOutline } from "./icons";

const ChipIconButton = ({ 
	icon = <DocumentOutline />,
	children = "Chip Icon Button",
	className, 
	...rest 
}) => {
	return (
		<button
			{...rest}
			className={cn(
				"flex items-center flex-shrink-0 gap-1.5 dark:bg-dark-shade-1 bg-white border border-gray-2 hover:border-gray-1 dark:border-clr47 dark:hover:border-gray-1 px-3 py-[6.5px] rounded-full text-sm font-normal transition truncate",
				className
			)}
		>
			{icon}
			<span>{children}</span>
		</button>
	);
};

export default ChipIconButton;