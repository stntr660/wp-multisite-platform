import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CHAT_WITH } from "../constants/type";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { handleWebTabSwitch } from "../store/slices/webSlice";
import { handleDocTabSwitch } from "../store/slices/documentSlice";
import {  handleIsFetchingNew, handleIsTabSwitch, selectChat } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const ContinueWithLast = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { trans } = useLangTranslation();
    const { lastChat } = useSelector((state) => state.chat);

    const continueLastChat = () => {
        dispatch(handleIsFetchingNew(true))
		dispatch(selectChat({ id: lastChat?.id, type: lastChat?.type }));
		
		if(lastChat?.type === CHAT_WITH.CHAT) {
			dispatch(handleIsTabSwitch(true));
            navigate(`${BASE_ROUTE_PATH}`);
		}
		else if(lastChat?.type === CHAT_WITH.IMAGE) {
            navigate(`${BASE_ROUTE_PATH}/image`);
		} else if (lastChat?.type === CHAT_WITH.DOCUMENT) {
			dispatch(handleDocTabSwitch(true));
            navigate(`${BASE_ROUTE_PATH}/document`);
		} else if (lastChat?.type === CHAT_WITH.WEB) {
			dispatch(handleWebTabSwitch(true));
            navigate(`${BASE_ROUTE_PATH}/web`);
		} 
	};

    return (
        <motion.button
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.2, delay: 0.2 }}
            onClick={continueLastChat}
            disabled={!lastChat}
            className="flex gap-4 bg-white dark:bg-dark-shade-1 dark:text-white max-w-[360px] w-full py-6 px-2.5 rounded-lg border border-white dark:border-dark-shade-1 hover:border hover:border-gray-1 hover:dark:border-gray-1 hover:transition hover:duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:border-none"
        >
            <p className="w-full text-center font-normal text-sm text-dark-1 dark:text-white">
                {trans("Continue your last chat")}
            </p>
        </motion.button>
    );
};

export default ContinueWithLast;
