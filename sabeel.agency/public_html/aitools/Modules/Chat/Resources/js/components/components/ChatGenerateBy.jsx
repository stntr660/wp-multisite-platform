import { motion } from "framer-motion";
const ChatGenerateBy = ({ title, subtitle, icon, i, ...rest }) => {
    return (
        <motion.button
            {...rest}
            initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.2, delay: i * 0.1 }}
            className="flex gap-4 bg-white text-left dark:bg-dark-shade-1 dark:text-white max-w-[360px] w-full p-4 rounded-lg border border-white dark:border-dark-shade-1 hover:border hover:border-gray-1 hover:dark:border-gray-1 hover:transition hover:duration-300"
        >
            <span className="flex-shrink-0">{icon}</span>
            <div>
                <p className="font-medium text-base">{title}</p>
                <p className="text-gray-1 text-2xs font-medium">{subtitle}</p>
            </div>
        </motion.button>
    );
};

export default ChatGenerateBy;
