const Tooltip = ({ title }) => {
    return (
        <div className="absolute -bottom-9 group-hover/tooltip:-bottom-8 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 dark:bg-white bg-clr47 dark:text-dark-1 text-white rounded-md z-10 px-2 py-1 font-medium text-2xs transition-all duration-200 ease-out whitespace-nowrap left-1/2 transform -translate-x-1/2">
            <span>{title}</span>
        </div>
    );
};

export default Tooltip;
