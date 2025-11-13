import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import ArrowBackIcon from "./icons/ArrowBackIcon";
import { useNavigate } from "react-router-dom";
import HistoryItemSkeleton from "./HistoryItemSkeleton";
import { useGetFilesQuery } from "../store/api/getFileApi";
import { handleWebDrawer } from "../store/slices/uiSlice";
import { apiSlice } from "../store/api/apiSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";
import WebHistoryItem from "./WebHistoryItem";
import { handleSelectedUrls, handleWebTabSwitch } from "../store/slices/webSlice";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { selectChat } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const WebHistory = ({ headerHeight }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();

	const { selectedUrl } = useSelector((state) => state.web);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [allURL, setAllURL] = useState([]);

	// ** Get files query
	const { data: files, isLoading: isFileLoading } = useGetFilesQuery({ type: "url" });

	const handleSelectItem = (item) => {
		// do something / select item
		navigate(`${BASE_ROUTE_PATH}/web`);
		dispatch(handleWebTabSwitch(true));
		if (!selectedUrl.length) {
			dispatch(selectChat(null));
		}
		dispatch(handleSelectedUrls({
			...item,
			isRemove: true,
		}));
	};

	// Query for get more conversation
	useEffect(() => {
		if (page > 1) {
			dispatch(apiSlice.endpoints.getMoreFiles.initiate(page));
		}
	}, [page, dispatch]);

	const fetchMore = () => {
		if (files?.data?.length < files?.pagination?.total) {
			setPage((prev) => prev + 1);
		} else {
			setHasMore(false);
		}
	};
	// End fetch more conversation

	// Search docs
	useEffect(() => {
		if (!isFileLoading && files?.data?.length) {
			const filteredHistory = files?.data?.filter((file) => !file?.parent_id);
			setAllURL(filteredHistory);
			if (searchKeyword.length) {
				const searchedHistory = filteredHistory.filter((item) =>
					item?.original_name
						?.toLowerCase()
						.includes(searchKeyword.toLowerCase())
				);
				setAllURL(searchedHistory);
			}
		} else if (!isFileLoading && files?.data?.length === 0) {
			setAllURL([]);
		}
	}, [files?.data, isFileLoading, searchKeyword]);

	// render content
	let content = null;
	if (isFileLoading) {
		content = (
			<>
				{Array(5)
					.fill()
					.map((_, i) => (
						<HistoryItemSkeleton key={i} />
					))}
			</>
		);
	}
	if (!isFileLoading && !allURL?.length) {
		content = <div className="text-center">{trans("No webpages found")}</div>;
	}
	if (!isFileLoading && allURL?.length) {
		content = (
			<InfiniteScroll
				dataLength={allURL?.length}
				next={fetchMore}
				hasMore={hasMore}
				loader={
					<div className="text-center">
						<Loader className="text-center before:dark:bg-dark-shade-2 before:bg-white" />
					</div>
				}
				scrollableTarget="scrollableWeb"
				className="space-y-3"
			>
				{allURL?.map((file) => (
					<WebHistoryItem
						key={file?.id}
						handleSelectItem={handleSelectItem}
						item={{
							id: file?.id,
							name: file?.name,
							title: file?.original_name,
							created_at: file?.created_at,
						}}
					/>
				))}
			</InfiniteScroll>
		);
	}

	return (
		<div className="h-full w-full">
			<div className="pl-5 pr-4 border-b border-b-gray-2 dark:border-b-clr47 h-[58px] flex items-center">
				<button
					onClick={() => dispatch(handleWebDrawer(false))}
					className="text-dark-1 dark:text-white flex items-center gap-1 text-sm font-normal"
				>
					<ArrowBackIcon />
					<span>{trans("Close")}</span>
				</button>
				<p className="w-[calc(100%-102px)] text-dark-1 dark:text-white text-lg font-medium text-center">
					{trans("All Webpages")}
				</p>
			</div>
			<div
				className={`flex flex-col gap-2`}
				style={{ height: `calc(100% - ${headerHeight}px)` }}
			>
				<div className="py-3 px-4 md:px-0 max-w-sm w-full md:w-[340px] mx-auto">
					<Input
						onChange={(e) => setSearchKeyword(e.target.value)}
						isShadow
						placeholder="Search your webpages.."
					/>
				</div>
				<div className="overflow-y-auto pb-2 pr-[3px]">
					<div
						className="px-4 h-full overflow-y-auto overflow-x-hidden space-y-3"
						id="scrollableWeb"
					>
						{content}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WebHistory;
