import { HistoryIcon } from "./icons";

const HistoryButton = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="py-1.5 px-2.5 rounded-lg text-sm text-dark-1 dark:text-white flex items-center gap-1.5 border border-gray-2 hover:border-gray-1 transition duration-200 ease-out"
        >
            <HistoryIcon />
            <span>{children}</span>
        </button>
    );
};

export default HistoryButton;
