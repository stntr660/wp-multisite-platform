import PropTypes from "prop-types";
import cn from "../utils/cn";

const IconButton = ({ icon, variant, className, ...rest }) => {
    return (
        <button
            {...rest}
            className={cn(
                "flex items-center justify-center bg-white dark:bg-dark-shade-2 h-9 w-9 rounded-lg border border-gray-2 hover:border-gray-1 dark:border-clr47 dark:hover:border-gray-1 transition",
                className,
                {
                    "bg-transparent dark:bg-transparent h-auto w-auto border-none":
                        variant === "text",
                    "h-8 w-8 bg-dark-1/60 hover:bg-dark-shade-2/60 dark:bg-dark-1/60 hover:dark:bg-dark-shade-2/60 border-[1px] border-clr47 hover:border-clr47 dark:hover:border-clr47 rounded-full transition-all duration-200":
                        variant === "img",
                }
            )}
        >
            {icon}
        </button>
    );
};

IconButton.propTypes = {
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

export default IconButton;
