import { useState } from "react";
import Paper from "./Paper";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ClockIcon, DeleteIcon } from "./icons";
import ChatDeleteDialog from "./ChatDeleteDialog";
import WebGlobeIcon from "./icons/WebGlobeIcon";
import { useDeleteFileMutation } from "../store/api/deleteFileApi";
import useLangTranslation from "../hooks/useLangTranslation";

const WebHistoryItem = ({ item, handleSelectItem }) => {
	const { trans } = useLangTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const { selectedUrl } = useSelector((state) => state.web);

	// ** Mutation to delete file
	const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();

	const handleDeleteDialog = (open) => {
		setIsOpen(open);
	};

	const handleIsDelete = async () => {
		try {
			await deleteFile({ id: item?.id }).unwrap();
		} catch (error) {
			toast.error(error?.data?.error);
		}
	};

	return (
		<Paper
			className={`group/item relative rounded-lg overflow-hidden cursor-pointer border transition ease-out duration-200 ${
				selectedUrl.find((file) => file?.id === item?.id)
					? "border-gray-2 dark:border-gray-1"
					: "border-white dark:border-dark-shade-1 hover:border-gray-2 hover:dark:border-gray-1"
			}`}
		>
			<div
				onClick={() => handleSelectItem(item)}
				className="flex gap-2 px-2.5 pt-2.5 pb-3.5"
			>
				<div>
					<div className="flex gap-5">
						<div className="flex items-center gap-[6px]">
							<WebGlobeIcon />
							<p className="text-gray-1 text-2xs font-medium">{trans("Web")}</p>
						</div>
						<div className="flex items-center gap-[6px]">
							<ClockIcon />
							<p className="text-gray-1 text-2xs font-medium">
								{item?.created_at}
							</p>
						</div>
					</div>
					<p className="text-base font-medium text-dark-1 dark:text-white pt-3 mb-[2px] line-clamp-1">
						{item?.name}
					</p>
					<p className="font-light text-[13px] leading-[22px] text-dark-1 dark:text-white line-clamp-1">
						{item?.title}
					</p>
				</div>
			</div>
			<div className="invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 flex items-center gap-4 absolute right-2.5 top-2.5 z-50 transition-all">
				<button
					onClick={() => handleDeleteDialog(true)}
					className="outline-none border-none text-gray-1 dark:text-white hover:text-[red]/80 dark:hover:text-gray-1"
				>
					<DeleteIcon />
				</button>
			</div>
			{/* docs delete confirmation modal */}
			<ChatDeleteDialog
				title={trans("Delete this doc?")}
				isOpen={isOpen}
				isLoading={isDeleting}
				handleIsDelete={handleIsDelete}
				handleDeleteDialog={handleDeleteDialog}
			/>
		</Paper>
	);
};

export default WebHistoryItem;
