import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import Loader from "./Loader";
import { ArrowBackIcon } from "./icons";
import HistoryItem from "./HistoryItem";
import { LAYOUT } from "../constants/layout";
import { CHAT_WITH } from "../constants/chat";
import { useNavigate } from "react-router-dom";
import { apiSlice } from "../store/api/apiSlice";
import HistoryItemSkeleton from "./HistoryItemSkeleton";
import { stayDocWebChat } from "../store/slices/uiSlice";
import { handleWebTabSwitch } from "../store/slices/webSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { handleDocTabSwitch } from "../store/slices/documentSlice";
import { useGetChatConversationQuery } from "../store/api/chatConversationApi";
import {  handleIsFetchingNew, handleIsTabSwitch, handleVisible, setChatPage, selectChat } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const HistoryDrawerContent = ({ handleHistory, headerHeight }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { trans } = useLangTranslation();
    const { layout } = useSelector((state) => state.ui);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);
    const { selectedChat } = useSelector((state) => state.chat);

    // Query for get conversation
    const { data: conversation, isLoading } = useGetChatConversationQuery();

    const handleSelectConversation = (item) => {
        dispatch(selectChat({ id: item?.id, type: item?.type }));
        if (selectedChat?.id !== item?.id) {
			dispatch(handleIsFetchingNew(true));
		}
        if (item?.type === CHAT_WITH.CHAT) {
            dispatch(handleIsTabSwitch(true));
            dispatch(handleVisible(false));
            dispatch(setChatPage(1));
            navigate(BASE_ROUTE_PATH);
            if (layout === LAYOUT.IMAGE || layout === LAYOUT.DOCUMENT) {
                navigate(BASE_ROUTE_PATH);
            }
        } else if (item?.type === CHAT_WITH.IMAGE) {
            navigate(`${BASE_ROUTE_PATH}/image`);
        } else if (item?.type === 'file') {
            dispatch(stayDocWebChat(false))
            navigate(`${BASE_ROUTE_PATH}/document`);
			dispatch(handleDocTabSwitch(true));
		} else if (item?.type === CHAT_WITH.URL) {
            dispatch(stayDocWebChat(false))
            navigate(`${BASE_ROUTE_PATH}/web`);
			dispatch(handleWebTabSwitch(true));
		}
    };

    // Query for get more conversation
    useEffect(() => {
        if (page > 1) {
            dispatch(apiSlice.endpoints.getMoreConversation.initiate(page));
        }
    }, [page, dispatch]);

    const fetchMore = () => {
        if (conversation?.data?.length < conversation?.pagination?.total) {
            setPage((prev) => prev + 1);
        } else {
            setHasMore(false);
        }
    };

    useEffect(() => {
        if (!isLoading && conversation?.data?.length) {
            setConversationHistory(conversation?.data);
            if (searchKeyword.length) {
                const filteredHistory = conversation?.data.filter((item) =>
                    item?.title
                        ?.toLowerCase()
                        .includes(searchKeyword.toLowerCase())
                );
                setConversationHistory(filteredHistory);
            }
        } else if (!isLoading && conversation?.data?.length === 0) {
			setConversationHistory([]);
		}
    }, [conversation?.data, isLoading, searchKeyword]);

    let render = null;
    if (isLoading) {
        render = (
            <>
                {Array(5)
                    .fill()
                    .map((_, i) => (
                        <HistoryItemSkeleton key={i} />
                    ))}
            </>
        );
    }
    if (!isLoading && !conversationHistory?.length) {
        render = <div className="text-center">{trans("No chat history found")}</div>;
    }
    if (!isLoading && conversationHistory?.length) {
        render = (
            <InfiniteScroll
                dataLength={conversationHistory?.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={
                    <div className="text-center">
                        <Loader className="text-center before:dark:bg-dark-shade-2 before:bg-white" />
                    </div>
                }
                scrollableTarget="scrollableDiv"
                className="space-y-3"
            >
                {conversationHistory?.map((item) => (
                    <HistoryItem
                        key={item?.uuid}
                        item={item}
                        handleSelectConversation={handleSelectConversation}
                    />
                ))}
            </InfiniteScroll>
        );
    }
    return (
        <div className="h-full w-full">
            <div className="pl-5 pr-4 border-b border-b-gray-2 dark:border-b-clr47 h-[58px] flex items-center">
                <button
                    onClick={handleHistory}
                    className="text-dark-1 dark:text-white flex items-center gap-1 text-sm font-normal"
                >
                    <ArrowBackIcon />
                    <span>{trans("Back")}</span>
                </button>
                <p className="w-[calc(100%-102px)] text-dark-1 dark:text-white text-lg font-medium text-center">
                    {trans("History")}
                </p>
            </div>
            <div
                className={`flex flex-col gap-2`}
                style={{ height: `calc(100% - ${headerHeight}px)` }}
            >
                <div className="py-3 px-4 md:px-0 max-w-sm w-full md:w-[340px] mx-auto">
                    <Input
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder={trans("Search your chat")}
                        isShadow
                    />
                </div>
                <div className="overflow-y-auto mb-2 pr-[3px]">
                    <div
                        className="px-4 h-full overflow-y-auto space-y-3"
                        id="scrollableDiv"
                    >
                        {render}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryDrawerContent;
