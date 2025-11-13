import { useCallback, useEffect, useRef, useState, useLayoutEffect, useMemo, Fragment } from "react";
import { toast } from "react-toastify";
import { TypeAnimation } from "react-type-animation";
import { useDispatch, useSelector } from "react-redux";
import { LAYOUT } from "../constants/layout";
import { apiSlice } from "../store/api/apiSlice";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useGetImageConversationByIdQuery } from "../store/api/imageConversationByIdApi";
import {
	HrzPositionWrapper,
	Loader,
	Paper,
	TabPanel,
	TextCard,
	ImageSkeleton,
	ImageCreatingSkeleton,
	ImageHolder,
} from "../components";
import { copyImageToClipboard } from "copy-image-clipboard";
import { useImageDeleteMutation } from "../store/api/imageDeleteApi";
import { setConversationLoading, setLayout } from "../store/slices/uiSlice";
import { handleIsFetchingNew, handleIsTabSwitch, selectChat, setChatPage } from "../store/slices/chatSlice";
import ImageViewModal from "../components/ImageViewModal";
import DeleteDialog from "../components/DeleteDialog";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { useNavigate } from "react-router-dom";
import useLangTranslation from "../hooks/useLangTranslation";

const Image = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const { initialImage } = useSelector((state) => state.image) || {};
	const { selectedChat, isFetchingNew, chatPage } = useSelector((state) => state.chat) || {};

	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState(null);
	const [copied, setCopied] = useState(false);
	const [copyImgId, setCopyImgId] = useState(null);
	const [selectItemForDelete, setSelectItemForDelete] = useState(null);
	const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

	const [count, setCount] = useState(0);
	const scrollableRootRef = useRef(null);
	const lastScrollDistanceToBottomRef = useRef();

	// ** Query for image conversation by id
	const {
		data: images,
		isSuccess,
		isLoading,
		isFetching,
		isError,
		error,
	} = useGetImageConversationByIdQuery(selectedChat?.id, {
		skip: selectedChat?.type !== "Image" || !selectedChat?.id,
	});

	// Mutation for image delete
	const [
		imageDelete,
		{
			data: deleteData,
			isLoading: deleting,
			isSuccess: isDeleteSuccess,
			isError: isDeleteError,
			error: deleteError,
		},
	] = useImageDeleteMutation();

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const handleDeleteDialog = (open) => {
		setIsOpenDeleteDialog(open);
	};

	const selectDeleteItem = (id) => {
		setSelectItemForDelete(id);
		handleDeleteDialog(true);
	};

	// image delete confirmation
	const handleIsDelete = () => {
		imageDelete({ id: selectItemForDelete });
	};

	const handleCopyImage = (url, id) => {
		setCopyImgId(id);
		copyImageToClipboard(url)
			.then(() => {
				setCopied(true);
			})
			.catch(() => {
				toast.error(
					trans("Image copy failed. Please try again or download the image.")
				);
			});
	};

	useEffect(() => {
		if (!deleting) {
			handleDeleteDialog(false);
		}
	}, [deleting]);

	useEffect(() => {
		if (isDeleteSuccess) {
			if(images?.data?.length == 1){
				dispatch(selectChat(null));
				dispatch(handleIsTabSwitch(false));
				navigate(BASE_ROUTE_PATH);
			}
			toast.success(deleteData?.response?.status?.message ?? trans("Image deleted successfully"));
		}
	}, [isDeleteSuccess]);

	// handle image delete error
	useEffect(() => {
		if (isDeleteError) {
			const { response } = deleteError.data || {};
			toast.error(
				response?.records?.response ??
					response?.status?.message ??
					trans("Image delete failed")
			);
		}
	}, [isDeleteError, deleteError]);

	// handle image conversation by id error
	useEffect(() => {
		if (isError) {
			const { response } = error?.data || {};
			toast.error(
				Array.isArray(response?.records)
					? trans("Sorry, couldn't load the image. Please check your internet connection and try again.")
					: response?.records ??
							response?.status?.message ??
							trans("Sorry, couldn't load the image. Please check your internet connection and try again.")
			);
		}
	}, [isError, error]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 500);
		return () => clearTimeout(timer);
	}, [copied]);

	// ** Query for more images
	const loadMore = () => {
		if (chatPage > 1) {
			dispatch(
				apiSlice.endpoints.getMoreImageConversationById.initiate({
					page: chatPage,
					id: selectedChat?.id,
				})
			);
		}
	};

	// ** handle pagination
	useEffect(() => {
		if (images?.pagination?.nextPage > 1) {
			dispatch(setChatPage(images?.pagination?.nextPage));
		}
	}, [images?.pagination?.nextPage, dispatch, isFetching]);

	const [infiniteRef, { rootRef }] = useInfiniteScroll({
		loading: isFetching,
		hasNextPage: true,
		onLoadMore: loadMore,
		disabled: !!isError,
	});

	const reversedItems = useMemo(
		() => images?.data && [...images.data].reverse(),
		[images?.data]
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

	useEffect(() => {
		if (!isFetching) dispatch(handleIsFetchingNew(isFetching));
	}, [selectedChat?.id, isFetching, dispatch]);

	useEffect(() => {
		dispatch(setConversationLoading(isFetching));
	}, [isFetching, dispatch]);

	useEffect(() => {
		dispatch(setLayout(LAYOUT.IMAGE));
	}, []);

	// Content what to render
	let content = null;

	if (!initialImage && isLoading) {
		content = (
			<TabPanel>
				<ImageSkeleton />
			</TabPanel>
		);
	}
	if (isFetching && isFetchingNew) {
		content = (
			<TabPanel>
				<ImageSkeleton />
			</TabPanel>
		);
	}
	if (!isLoading && !isFetchingNew && images?.data?.length) {
		content = (
			<div
				className="h-full overflow-y-auto space-y-3 w-full"
				ref={rootRefSetter}
				onScroll={handleRootScroll}
			>
				<div className="max-w-[960px] w-full mx-auto p-5 flex flex-col gap-3 h-full">
					{chatPage > 1 &&
						images?.pagination?.total != images?.data?.length && (
							<div className="text-center" ref={infiniteRef}>
								<Loader className="text-center before:dark:bg-dark-bg before:bg-bg-1" />
							</div>
						)}
					{images?.data
						.slice()
						.sort((a, b) => a.id - b.id)
						.map((item) => (
							<Fragment key={item?.id}>
								<HrzPositionWrapper $align="right">
									<TextCard variant="filled">{item?.name}</TextCard>
								</HrzPositionWrapper>

								{/* single image */}
								{typeof item?.imageUrl === "string" ? (
									<HrzPositionWrapper className="!w-fit">
										{/* if item?.isFake skeleton otherwise image */}
										{item?.isFake ? (
											<Paper className="p-2.5 rounded-[10px] w-full sm:!w-[512px]">
												<TypeAnimation
													sequence={[
														trans("Generating imaginations true to life.."),
														1000,
														trans("Generating imaginations limitless dreams.."),
														1000,
														trans("Generating imaginations endless possibilities.."),
														1000,
														trans("Generating imaginations infinite horizons.."),
													]}
													wrapper="p"
													speed={50}
													className="text-sm pb-2.5"
													repeat={Infinity}
												/>
												<ImageCreatingSkeleton />
											</Paper>
										) : (
											<Paper className="group/item p-2.5 rounded-[10px] w-full h-full overflow-hidden">
												<ImageHolder
													item={item}
													setImage={setImage}
													copied={copied}
													copyImgId={copyImgId}
													openModal={openModal}
													handleCopyImage={handleCopyImage}
													selectDeleteItem={selectDeleteItem}
												/>
											</Paper>
										)}
									</HrzPositionWrapper>
								) : (
									// multiple images
									<HrzPositionWrapper className="!w-fit">
										<Paper className="grid grid-cols-2 gap-2.5 p-2.5 rounded-[10px] w-full h-full overflow-hidden">
											{item?.imageUrl?.map((img, idx) => (
												<ImageHolder
													key={idx}
													item={{
														...item,
														id: img?.id,
														imageUrl: img?.url,
													}}
													setImage={setImage}
													copied={copied}
													copyImgId={copyImgId}
													openModal={openModal}
													handleCopyImage={handleCopyImage}
													selectDeleteItem={selectDeleteItem}
												/>
											))}
										</Paper>
									</HrzPositionWrapper>
								)}
							</Fragment>
						))}
				</div>
			</div>
		);
	}

	return (
		<Fragment>
			{content}
			{initialImage && (
				<TabPanel className="flex flex-col gap-3">
					<HrzPositionWrapper $align="right">
						<TextCard variant="filled">{initialImage?.name}</TextCard>
					</HrzPositionWrapper>
					<HrzPositionWrapper className="w-full sm:!w-[512px]">
						<Paper className="p-2.5 rounded-[10px] w-full">
							<TypeAnimation
								sequence={[
									trans("Generating imaginations true to life.."),
									1000,
									trans("Generating imaginations limitless dreams.."),
									1000,
									trans("Generating imaginations endless possibilities.."),
									1000,
									trans("Generating imaginations infinite horizons.."),
								]}
								wrapper="p"
								speed={50}
								className="text-sm pb-2.5"
								repeat={Infinity}
							/>
							<ImageCreatingSkeleton />
						</Paper>
					</HrzPositionWrapper>
				</TabPanel>
			)}
			{/* Image view modal */}
			<ImageViewModal
				isOpen={isOpen}
				closeModal={closeModal}
				item={image}
				handleCopyImage={handleCopyImage}
				copyImgId={copyImgId}
				copied={copied}
			/>
			{/* Image delete modal */}
			<DeleteDialog
				title={trans("Delete chat?")}
				isOpen={isOpenDeleteDialog}
				handleDeleteDialog={handleDeleteDialog}
				isLoading={deleting}
				handleIsDelete={handleIsDelete}
			/>
		</Fragment>
	);
};

export default Image;
