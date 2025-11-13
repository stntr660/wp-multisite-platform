const Avatar = ({ assistants }) => {
	return (
		<div className="relative group/item gradient-5 h-[52px] w-[52px] shadow-aiavatar rounded-full flex-shrink-0 p-1">
			{assistants?.image_url ? (
				<img
					src={assistants?.image_url}
					alt="avatar"
					className="h-full w-full object-cover rounded-full"
				/>
			) : (
				<img
                src={
                    "Modules/Chat/Resources/js/components/assets/images/ai-default.svg"
                }
					alt="avatar"
					className="h-full w-full object-cover rounded-full"
				/>
			)}
			{assistants?.name && <Tooltip title={assistants?.name} />}
			{assistants?.artStyles && <Tooltip title={assistants?.artStyles} />}
		</div>
	);
};

export default Avatar;

const Tooltip = ({ title }) => {
	return (
		<div className="absolute -top-8 invisible opacity-0 group-hover/item:visible group-hover/item:-top-[41px] group-hover/item:opacity-100 dark:bg-white bg-clr47 dark:text-dark-1 text-white rounded-md z-10 px-2 py-1 font-medium text-2xs transition-all duration-200 ease-out whitespace-nowrap">
			<span>{title}</span>
		</div>
	);
};