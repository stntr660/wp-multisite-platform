import {
	Fragment,
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
	useLayoutEffect,
} from "react";


// ** Import hooks
import useInfiniteScroll from "react-infinite-scroll-hook";

// ** Import redux
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "../../store/api/apiSlice";
import { handleSelectedUrlsByRequest } from "../../store/slices/webSlice";
import { handleIsFetchingNew, setChatPage } from "../../store/slices/chatSlice";
import { handleWebDrawer, setConversationLoading } from "../../store/slices/uiSlice";
import { useGetFileConversationByIdQuery } from "../../store/api/fileConversationByIdApi";

// ** Import component
import {
	Loader,
	TabPanel,
	TextCard,
	HrzPositionWrapper,
	ConversationSkeleton,
} from "../../components";
import BotAwait from "../../components/BotAwait";
import ConversationWebItem from "../../components/ConversationWebItem";

const WebsiteChat = () => {
	const dispatch = useDispatch();
	const [count, setCount] = useState(0);
	const [copied, setCopied] = useState(false);
	const { initDocWebChatStay } = useSelector((state) => state.ui) || {};
	const { selectedUrl, initialWebChat } = useSelector((state) => state.web) || {};
	const { isFetchingNew, selectedChat, isVisible, chatPage } = useSelector((state) => state.chat) || {};

	// ** Query to get conversation by file id
	const {
		data: conversations,
		isSuccess,
		isLoading,
		isFetching,
		isError,
	} = useGetFileConversationByIdQuery(selectedChat?.id, {
		skip: !selectedChat?.id,
	});

	// ** Query for more conversation by file id
	const loadMore = () => {
		if (chatPage > 1) {
			dispatch(
				apiSlice.endpoints.getMoreFileConversationById.initiate({
					page: chatPage,
					id: selectedChat?.id,
				})
			);
		}
	};

	// ** handle pagination
	useEffect(() => {
		if (conversations?.pagination?.nextPage > 1) {
			dispatch(setChatPage(conversations?.pagination?.nextPage));
		}
	}, [conversations?.pagination?.nextPage, dispatch, isFetching]);

	const [infiniteRef, { rootRef }] = useInfiniteScroll({
		loading: isFetching,
		hasNextPage: true,
		onLoadMore: loadMore,
		disabled: !!isError,
	});

	const scrollableRootRef = useRef(null);
	const lastScrollDistanceToBottomRef = useRef();

	const reversedItems = useMemo(
		() => conversations?.data && [...conversations.data].reverse(),
		[conversations?.data]
	);

	// We keep the scroll position when new items are added etc.
	useLayoutEffect(() => {
		const scrollableRoot = scrollableRootRef.current;
		const lastScrollDistanceToBottom =
			lastScrollDistanceToBottomRef.current ?? 0;
		if (scrollableRoot) {
			scrollableRoot.scrollTop =
				scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
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

	// start file selection
	useEffect(() => {
		const item = conversations?.data?.[1] || {};
		if(item?.type === "url_chat_reply" && item?.files) {
			const files = item?.files?.map((file) => ({
				id: file?.id,
				title: file?.original_name,
				created_at: file?.created_at,
				isRemove: false,
			}));
			dispatch(handleSelectedUrlsByRequest(files));
			dispatch(handleWebDrawer(false))
		}
	}, [conversations?.data, dispatch]);
	// end file selection

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [copied]);

	useEffect(() => {
		if (!isFetching) dispatch(handleIsFetchingNew(isFetching));
	}, [selectedChat?.id, isFetching, dispatch]);

	useEffect(() => {
		dispatch(setConversationLoading(isFetching));
	}, [isFetching, dispatch]);

	// Content what to render
	let content = null;

	if (!initialWebChat.length && isLoading) {
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
	if (!isLoading && !isFetchingNew && conversations?.data?.length) {
		content = (
			<div
				className="h-full overflow-y-auto space-y-3 w-full"
				ref={rootRefSetter}
				onScroll={handleRootScroll}
			>
				<div className="max-w-[960px] w-full mx-auto p-5 flex flex-col gap-3 h-full">
					{chatPage > 1 &&
						conversations?.pagination?.total != conversations?.data?.length && (
							<div className="text-center" ref={infiniteRef}>
								<Loader className="text-center before:dark:bg-dark-bg before:bg-bg-1" />
							</div>
						)}

					{/* show selected files */}
					{!isFetchingNew && (
						<Fragment>
							{selectedUrl?.length > 0 &&
								selectedUrl.map((file) => (
									<HrzPositionWrapper key={file?.id}>
										<ConversationWebItem file={file} />
									</HrzPositionWrapper>
								))}
						</Fragment>
					)}

					{conversations?.data
						.slice()
						.sort((a, b) => a.id - b.id)
						.map((chat, _idx) =>
							chat?.meta?.user_reply ? (
								<HrzPositionWrapper key={chat?.id} $align="right">
									<TextCard variant="filled">{chat?.meta?.user_reply}</TextCard>
								</HrzPositionWrapper>
							) : (
								<HrzPositionWrapper key={chat?.id} className="!flex-row">
									{/* <CharacterAvatar
										avatar={chat?.bot_image}
										alt={chat?.bot_name}
									/> */}
									<TextCard
										className="max-w-[inherit]"
										character="bot"
										isLastMessage={conversations?.data?.length - 1 === _idx}
									>
										{chat?.meta?.bot_reply}
									</TextCard>
								</HrzPositionWrapper>
							)
						)}
					{/* bot typing for temp data */}
					{conversations?.data?.find((item) => item?.isTemp) && (
						<BotAwait isAvatar={false} />
					)}
				</div>
			</div>
		);
	}

	return (
		<Fragment>
			{/* show selected files */}
			{!isFetchingNew &&
				!initialWebChat.length &&
				!conversations?.data?.length && (
					<TabPanel className="flex flex-col gap-3">
						{selectedUrl?.length > 0 &&
							selectedUrl.map((file) => (
								<HrzPositionWrapper key={file?.id}>
									<ConversationWebItem file={file} />
								</HrzPositionWrapper>
							))}
					</TabPanel>
				)}

			{/* main content */}
			{content}

			{isVisible && initDocWebChatStay && initialWebChat.length > 0 && (
				<TabPanel className="flex flex-col gap-3">
					{/* show selected files */}
					{selectedUrl?.length > 0 &&
						selectedUrl.map((file) => (
							<HrzPositionWrapper key={file?.id}>
								<ConversationWebItem file={file} />
							</HrzPositionWrapper>
						))}
					{initialWebChat.map((chat, _idx) =>
						chat?.meta?.user_reply ? (
							<HrzPositionWrapper key={chat?.id} $align="right">
								<TextCard variant="filled">{chat?.meta?.user_reply}</TextCard>
							</HrzPositionWrapper>
						) : (
							<HrzPositionWrapper key={chat?.id} className="!flex-row">
								{/* <CharacterAvatar
									avatar={chat?.bot_image}
									alt={chat?.bot_name}
								/> */}
								<TextCard
									className="max-w-[inherit]"
									character="bot"
									isLastMessage={conversations?.data?.length - 1 === _idx}
								>
									{chat?.meta?.bot_reply}
								</TextCard>
							</HrzPositionWrapper>
						)
					)}
					{/* bot typing for initial data */}
					{initialWebChat?.length == 1 && <BotAwait isAvatar={false} />}
				</TabPanel>
			)}
		</Fragment>
	);
};

export default WebsiteChat;
