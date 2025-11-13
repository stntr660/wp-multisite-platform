import PropTypes from "prop-types";
const ThemeButton = ({ onClick, icon, children, ...rest }) => {
	return (
		<button
			{...rest}
			onClick={onClick}
			className="h-[34px] w-[34px] md:w-fit flex justify-center items-center gap-1.5 text-sm text-dark-1 dark:text-white font-normal border border-gray-2 dark:border-clr47 px-2.5 py-1.5 rounded-lg active hover:border-gray-1 hover:dark:border-gray-1 transition-all duration-200 ease-out"
		>
			{icon}
			{children}
		</button>
	);
};

ThemeButton.propTypes = {
	icon: PropTypes.node.isRequired,
	onClick: PropTypes.func,
};

export default ThemeButton;
