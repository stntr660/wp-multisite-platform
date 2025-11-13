import { useState } from "react";
import Paper from "./Paper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CHAT_WITH } from "../constants/type";
import ChatDeleteDialog from "./ChatDeleteDialog";
import { useSelector, useDispatch } from "react-redux";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { useDeleteChatMutation } from "../store/api/deleteChatApi";
import { clearSelectedUrls, handleWebTabSwitch } from "../store/slices/webSlice";
import { clearSelectedFiles, handleDocTabSwitch } from "../store/slices/documentSlice";
import { ClockIon, DeleteIcon, DoubleChatIcon, DoubleImageIcon } from "./icons";
import { handleIsTabSwitch, handleVisible, selectChat, storeLastChat } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const HistoryItem = ({ item, handleSelectConversation}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { trans } = useLangTranslation();

    const { selectedChat, lastChat } = useSelector((state) => state.chat);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    // ** Mutation to delete chat
	const [ deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();

    // ** delete confirmation
	const handleIsDelete = async () => {
		await deleteChat({ id: item?.id, type: item?.type }).unwrap()
		.then(() => {
            if (item?.id === selectedChat?.id) {
                dispatch(handleIsTabSwitch(false));
                dispatch(handleWebTabSwitch(false));
				dispatch(handleDocTabSwitch(false));
                dispatch(handleVisible(true));
                dispatch(clearSelectedFiles());
		        dispatch(clearSelectedUrls());
                dispatch(selectChat(null));
            }
            if (item?.id === lastChat?.id) {
                dispatch(storeLastChat(null));
            }
            if(selectedChat.type === CHAT_WITH.IMAGE){
                navigate(BASE_ROUTE_PATH);
            }
		})
		.catch((error) => {
			const { status } = error?.data?.response || {};
			toast.error(status?.message);
		});
	}; 

    const handleDeleteDialog = (open) => {
        setIsOpenDeleteDialog(open);
    };

    return (
        <Paper
            className={`relative rounded-lg overflow-hidden cursor-pointer border transition ease-out duration-200 select-none ${
                selectedChat?.id == item?.id
                    ? "border-gray-2 dark:border-gray-1"
                    : "border-white dark:border-dark-shade-1 hover:border-gray-2 hover:dark:border-gray-1"
            }`}
        >
            <div
                onClick={() => handleSelectConversation(item)}
                className="px-2.5 pt-2.5 pb-3.5"
            >
                <div className="flex items-center gap-5 justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-gray-1">
                            {item?.type === CHAT_WITH.CHAT && <DoubleChatIcon />}
							{item?.type === CHAT_WITH.IMAGE && <DoubleImageIcon />}
                            <p className="text-gray-1 text-2xs font-medium capitalize ">{item?.type === 'url' ? trans('Web') : trans(item?.type)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIon />
                            <p className="text-gray-1 text-2xs font-medium">
                                {item?.created_at}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-sm pt-3">
                    {item?.title?.length > 90
                        ? item?.title?.slice(0, 90) + "..."
                        : item?.title}
                </p>
            </div>
            <button
                onClick={() => handleDeleteDialog(true)}
                className="rounded-tr-lg flex justify-center items-center absolute right-[10px] top-[10px] z-50 text-gray-1 dark:text-white hover:text-[red]/80 dark:hover:text-gray-1"
            >
                <DeleteIcon />
            </button>
            {/* chat delete modal */}
            <ChatDeleteDialog
                title={trans("Delete chat?")}
                isOpen={isOpenDeleteDialog}
                handleDeleteDialog={handleDeleteDialog}
                isLoading={isDeleting}
                handleIsDelete={handleIsDelete}
            />
        </Paper>
    );
};

export default HistoryItem;
