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
import BotAwait from "./BotAwait";
import TabPanel from "./TabPanel";
import TextCard from "./TextCard";
import { apiSlice } from "../store/api/apiSlice";
import HrzPositionWrapper from "./HrzPositionWrapper";
import { useDispatch, useSelector } from "react-redux";
import ConversationDocsItem from "./ConversationDocsItem";
import ConversationSkeleton from "./ConversationSkeleton";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { handleDocsDrawer, setConversationLoading } from "../store/slices/uiSlice";
import { handleIsFetchingNew, setChatPage } from "../store/slices/chatSlice";
import { useGetFileConversationByIdQuery } from "../store/api/fileConversationByIdApi";
import { handleSelectedFilesByRequest } from "../store/slices/documentSlice";

const DocumentConversationPanel = () => {
	const dispatch = useDispatch();
	const [count, setCount] = useState(0);
	const [copied, setCopied] = useState(false);
	const { initDocWebChatStay } = useSelector((state) => state.ui) || {};
	const { selectedFiles, initialDocChat } = useSelector((state) => state.document) || {};
	const { isFetchingNew, selectedChat, isVisible, chatPage } = useSelector((state) => state.chat) || {};

	// ** Query to get conversation by file id
	const {
		data: conversations,
		isSuccess,
		isLoading,
		isFetching,
		isError,
	} = useGetFileConversationByIdQuery(selectedChat?.id, { skip: !selectedChat?.id });

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
		if(item?.type === "file_chat_reply" && item?.files) {
			const files = item?.files?.map((file) => ({
				id: file?.id,
				title: file?.original_name,
				file_url: file?.file_url,
				created_at: file?.created_at,
				isRemove: false,
			}));
			dispatch(handleSelectedFilesByRequest(files));
			dispatch(handleDocsDrawer(false))
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

	if (!initialDocChat.length && isLoading) { 
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
						{selectedFiles?.length > 0 &&
							selectedFiles.map((file) => (
								<HrzPositionWrapper key={file?.id} $align="right">
									<ConversationDocsItem file={file} />
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
					{conversations?.data?.find((item) => item?.isTemp) && <BotAwait isAvatar={false} />}
				</div>
			</div>
		);
	}
	
	return (
		<Fragment>
			{/* show selected files */}
			{!isFetchingNew && !initialDocChat.length && !conversations?.data?.length && (
				<TabPanel className="flex flex-col gap-3">
					{selectedFiles?.length > 0 &&
						selectedFiles.map((file) => (
							<HrzPositionWrapper key={file?.id} $align="right">
								<ConversationDocsItem file={file} />
							</HrzPositionWrapper>
						))}
				</TabPanel>
			)}

			{/* main content */}
			{content}

			{isVisible && initDocWebChatStay && initialDocChat.length > 0 &&  (
				<TabPanel className="flex flex-col gap-3">
					{/* show selected files */}
					{selectedFiles?.length > 0 &&
						selectedFiles.map((file) => (
							<HrzPositionWrapper key={file?.id} $align="right">
								<ConversationDocsItem file={file} />
							</HrzPositionWrapper>
						))}
					{initialDocChat.map((chat, _idx) =>
						chat?.meta?.user_reply ? (
							<HrzPositionWrapper key={chat?.id} $align="right">
								<TextCard variant="filled">{chat?.meta?.user_reply}</TextCard>
							</HrzPositionWrapper>
						) : (
							<HrzPositionWrapper key={chat?.id} className="!flex-row">
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
					{initialDocChat?.length == 1 && <BotAwait isAvatar={false} />}
				</TabPanel>
			)}
		</Fragment>
	);
};

export default DocumentConversationPanel;
