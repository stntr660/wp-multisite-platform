import { SearchIcon } from "./icons";

const Input = ({ onChange, isShadow, ...rest }) => {
    return (
        <div className="w-full relative z-5">
            <div className="absolute h-full flex items-center px-2.5 rounded-xl">
                <SearchIcon />
            </div>
            <input
                {...rest}
                onChange={onChange}
                className={`w-full p-2.5 pl-9 bg-white dark:bg-dark-shade-1 border border-gray-2 dark:border-clr47 rounded-xl text-sm font-normal focus:outline-none active:outline-none hover:border-gray-1 transition ease-out duration-200 placeholder:text-gray-1 text-dark-1 dark:text-white ${
                    isShadow ? "shadow-input" : ""
                }`}
            />
        </div>
    );
};

export default Input;
