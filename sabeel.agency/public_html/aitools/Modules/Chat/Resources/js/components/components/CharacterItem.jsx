import CharacterAvatar from "./CharacterAvatar";
import { motion } from "framer-motion";

const CharacterItem = ({
    i,
    title,
    subtitle,
    avatar,
    bot_plan,
    active,
    ...rest
}) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: i * 0.1 }}
            {...rest}
            className={`w-full group flex items-center gap-3 transition-all duration-200 ease-out py-[14px] px-[15px] border-b border-bg-1 dark:border-clr47 ${
                active
                    ? "bg-purple hover:bg-purple"
                    : "hover:bg-bg-1 dark:hover:bg-dark-shade-2"
            }`}
        >
            <CharacterAvatar avatar={avatar} alt={title} sm />
            <div>
                <p
                    className={`text-left text-15 font-medium ${
                        active ? "text-white" : "text-dark-1 dark:text-white"
                    }
			`}
                >
                    {title}
                    {bot_plan && (
                        <span className="text-3xs ml-[6px] bg-gold text-dark-1 px-1.5 py-[1.5px] rounded-xl">
                            {bot_plan}
                        </span>
                    )}
                </p>
                <p
                    className={`text-left text-2xs ${
                        active ? "text-white" : "text-gray-1"
                    }`}
                >
                    {subtitle}
                </p>
            </div>
        </motion.button>
    );
};

export default CharacterItem;
