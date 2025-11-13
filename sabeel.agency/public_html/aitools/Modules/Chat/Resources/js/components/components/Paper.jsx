import cn from "../utils/cn";

const Paper = ({ onClick, className, children }) => {
    return (
        <div
            onClick={onClick}
            className={cn("bg-white dark:bg-dark-shade-1", className)}
        >
            {children}
        </div>
    );
};

export default Paper;
