import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import DocsHistoryItem from "./DocsHistoryItem";
import { apiSlice } from "../store/api/apiSlice";
import ArrowBackIcon from "./icons/ArrowBackIcon";
import HistoryItemSkeleton from "./HistoryItemSkeleton";
import { useGetFilesQuery } from "../store/api/getFileApi";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { handleDocsDrawer } from "../store/slices/uiSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { handleDocTabSwitch, handleSelectedFiles } from "../store/slices/documentSlice";
import { selectChat } from "../store/slices/chatSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const DocumentHistory = ({ headerHeight }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const { selectedFiles } = useSelector((state) => state.document);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [allDocs, setAllDocs] = useState([]);

	// ** Get files query
	const { data: files, isLoading: isFileLoading } = useGetFilesQuery({type: 'file'});

    const handleSelectItem = (item) => {
        navigate(`${BASE_ROUTE_PATH}/document`);
		dispatch(handleDocTabSwitch(true));
		if (!selectedFiles.length) {
			dispatch(selectChat(null));
		}
		dispatch(handleSelectedFiles({
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
			setAllDocs(filteredHistory);
			if (searchKeyword.length) {
				const searchedHistory = filteredHistory.filter((item) =>
					item?.original_name
						?.toLowerCase()
						.includes(searchKeyword.toLowerCase())
				);
				setAllDocs(searchedHistory);
			}
		} else if (!isFileLoading && files?.data?.length === 0) {
			setAllDocs([]);
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
	if (!isFileLoading && !allDocs.length) {
		content = <div className="text-center">No documents found</div>;
	}
	if (!isFileLoading && allDocs?.length) {
		content = (
			<InfiniteScroll
				dataLength={allDocs?.length}
				next={fetchMore}
				hasMore={hasMore}
				loader={
					<div className="text-center">
						<Loader className="text-center before:dark:bg-dark-shade-2 before:bg-white" />
					</div>
				}
				scrollableTarget="scrollableDocument"
				className="space-y-3"
			>
				{allDocs?.map((file) => (
					<DocsHistoryItem
						key={file?.id}
						handleSelectItem={handleSelectItem}
						item={{
							id: file?.id,
							title: file?.original_name,
							file_url: file?.file_url,
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
                    onClick={() => dispatch(handleDocsDrawer(false))}
                    className="text-dark-1 dark:text-white flex items-center gap-1 text-sm font-normal"
                >
                    <ArrowBackIcon />
                    <span>{trans("Close")}</span>
                </button>
                <p className="w-[calc(100%-102px)] text-dark-1 dark:text-white text-lg font-medium text-center">
                    {trans("All Documents")}
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
                        placeholder={trans("Search your doc")}
                    />
                </div>
                <div className="overflow-y-auto pb-2 pr-[3px]">
                    <div
                        className="px-4 h-full overflow-y-auto overflow-x-hidden space-y-3"
                        id="scrollableDocument"
                    >
                       {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentHistory;
