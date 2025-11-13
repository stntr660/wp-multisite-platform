import {
    useRef,
	useMemo,
	useState,
	Fragment,
	useEffect,
	useCallback,
	useLayoutEffect,
} from "react";
import Loader from "./Loader";
import TabPanel from "./TabPanel";
import TextCard from "./TextCard";
import BotAwait from "./BotAwait";
import { toast } from "react-toastify";
import ChatGreetings from "./ChatGreetings";
import { LAYOUT } from "../constants/layout";
import CharacterAvatar from "./CharacterAvatar";
import { apiSlice } from "../store/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import HrzPositionWrapper from "./HrzPositionWrapper";
import useInfiniteScroll from "react-infinite-scroll-hook";
import ConversationSkeleton from "./ConversationSkeleton";
import { useGetChatByIdQuery } from "../store/api/chatApi";
import { setConversationLoading, setLayout } from "../store/slices/uiSlice";
import { handleIsFetchingNew, setChatPage } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";


const ConversationsPanel = () => {
    const dispatch = useDispatch();
    const { trans } = useLangTranslation();
    const { initialChat, selectedChat, isFetchingNew, chatPage, isVisible } = useSelector((state) => state.chat) || {};
    const [count, setCount] = useState(0);
    const scrollableRootRef = useRef(null);
    const lastScrollDistanceToBottomRef = useRef();

    // ** Query to get chat history by conversation id
    const {
        data: chatHistory,
        isSuccess,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetChatByIdQuery(selectedChat?.id, { skip: !selectedChat?.id });

    // ** Query for more chat history
    const loadMore = () => {
        if (chatPage > 1) {
            dispatch(
                apiSlice.endpoints.getMoreChatById.initiate({
                    page: chatPage,
                    conversationId: selectedChat?.id,
                })
            );
        }
    };

    // ** handle pagination
    useEffect(() => {
		if (chatHistory?.pagination?.nextPage > 1) {
			dispatch(setChatPage(chatHistory?.pagination?.nextPage));
		}
	}, [chatHistory?.pagination?.nextPage, dispatch, isFetching]);

    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading: isFetching,
        hasNextPage: true,
        onLoadMore: loadMore,
        disabled: !!isError,
    });

    const reversedItems = useMemo(
        () => chatHistory?.data && [...chatHistory.data].reverse(),
        [chatHistory?.data]
    );

    // We keep the scroll position when new items are added etc.
    useLayoutEffect(() => {
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom =  lastScrollDistanceToBottomRef.current ?? 0;
        if (scrollableRoot) {
            scrollableRoot.scrollTop = scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
        }
    }, [reversedItems, rootRef]);

    const rootRefSetter = useCallback(
        (node) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef]
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
            lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
        }
    }, []);

    useEffect(() => {
        if (isSuccess) {
            setCount(1);
        }
        if (isFetchingNew) {
            setCount(0);
        }
    }, [isSuccess, isFetchingNew]);

    useEffect(() => {
        if (count === 1) {
            const timer = setTimeout(() => {
                setCount(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [count]);

    // if conversation id change scroll to bottom
    useEffect(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            rootNode.scrollTop = rootNode.scrollHeight;
        }
    }, [selectedChat?.id]);

    // if page === 1 scroll to bottom
    useEffect(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode && chatPage === 1) {
            rootNode.scrollTop = rootNode.scrollHeight;
        }
    }, [chatPage]);

    // if count === 1 scroll to bottom
    useEffect(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode && count === 1) {
            rootNode.scrollTop = rootNode.scrollHeight;
        }
    }, [count]);

    useEffect(() => {
        if (!isFetching) dispatch(handleIsFetchingNew(isFetching));
    }, [selectedChat?.id, isFetching, dispatch]);

    useEffect(() => {
        dispatch(setConversationLoading(isFetching));
    }, [isFetching, dispatch]);

    useEffect(() => {
        dispatch(setLayout(LAYOUT.CONVERSATION));
    }, []);

    // handle chat conversation by id error
	useEffect(() => {
		if (isError) {
			toast.error(error?.data?.error ?? trans("There was an error fetching the chat."));
		}
	}, [isError, error]);

    // Content what to render
    let content = null;

    if (!initialChat.length && isLoading) {
        content = (
            <TabPanel>
                <ConversationSkeleton />
            </TabPanel>
        );
    }
    if (isFetching && isFetchingNew) {
        content = (
            <TabPanel>
                <ConversationSkeleton />
            </TabPanel>
        );
    }
    if (!isLoading && !isFetchingNew && chatHistory?.data?.length) {
        content = (
            <div
                className="h-full overflow-y-auto space-y-3 w-full"
                ref={rootRefSetter}
                onScroll={handleRootScroll}
            >
                <div className="max-w-[960px] w-full mx-auto p-5 flex flex-col gap-3 h-full">
                    {chatPage > 1 &&
                        chatHistory?.pagination?.total !=
                            chatHistory?.data?.length && (
                            <div className="text-center" ref={infiniteRef}>
                                <Loader className="text-center before:dark:bg-dark-bg before:bg-bg-1" />
                            </div>
                        )}
                    
                    {/* chat greetings */}
					{!isFetchingNew && <ChatGreetings />}
                    
                    {chatHistory?.data
                        .slice()
                        .sort((a, b) => a.id - b.id)
                        .map((chat, _idx) =>
                            chat?.meta?.user_reply ? (
                                <HrzPositionWrapper key={chat?.id} $align="right">
                                    <TextCard variant="filled">
                                        {chat?.meta?.user_reply}
                                    </TextCard>
                                </HrzPositionWrapper>
                            ) : (
                                <HrzPositionWrapper key={chat?.id} className="!flex-row">
                                    <CharacterAvatar
                                        avatar={chat?.bot_details?.image_url}
                                        alt={chat?.bot_name}
                                    />
                                    <TextCard
                                        className="max-w-[inherit]"
                                        character="bot"
                                        isLastMessage={chatHistory?.data?.length - 1 === _idx}
                                    >
                                        {chat?.meta?.bot_reply}
                                    </TextCard>
                                </HrzPositionWrapper>
                            )
                        )}

                    {/* bot typing for temp data */}
					{chatHistory?.data?.find((item) => item?.isTemp) && <BotAwait />}
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            {/* chat greetings */}
			{!isFetchingNew && !initialChat?.length && !chatHistory?.data?.length && (
				<TabPanel className="flex flex-col gap-3">
					<ChatGreetings />
				</TabPanel>
			)}

            {/* main content */}
            {content}

            {isVisible && initialChat?.length > 0 && (
				<TabPanel className="flex flex-col gap-3">
                    {/* chat greetings */}
					<ChatGreetings />
					{initialChat.map((chat, _idx) =>
						chat?.user_message ? (
							<HrzPositionWrapper key={chat?.id} $align="right">
								<TextCard variant="filled">{chat?.user_message}</TextCard>
							</HrzPositionWrapper>
						) : (
							<HrzPositionWrapper key={chat?.id} className="!flex-row">
								<CharacterAvatar
									avatar={chat?.bot_image}
									alt={chat?.bot_name}
								/>
								<TextCard
                                    className="max-w-[inherit]"
									character="bot"
									isLastMessage={chatHistory?.data?.length - 1 === _idx}
								>
									{chat?.bot_message}
								</TextCard>
							</HrzPositionWrapper>
						)
					)}
                    {/* bot typing for initial data */}
					{initialChat?.length == 1 && <BotAwait />}
				</TabPanel>
			)}
        </Fragment>
    );
}

export default ConversationsPanel;
