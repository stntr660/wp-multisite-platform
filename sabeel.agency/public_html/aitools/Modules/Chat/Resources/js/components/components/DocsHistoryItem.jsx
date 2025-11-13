import { useState } from "react";
import Paper from "./Paper";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ChatDeleteDialog from "./ChatDeleteDialog";
import { DeleteIcon, DownloadIcon, DocumentItemIcon } from "./icons";
import { useDeleteFileMutation } from "../store/api/deleteFileApi";
import useLangTranslation from "../hooks/useLangTranslation";

const DocsHistoryItem = ({ item, handleSelectItem }) => {
    const { trans } = useLangTranslation();
    const { selectedFiles }  = useSelector(state => state.document);
    const [isOpen, setIsOpen] = useState(false);

    // ** Mutation to delete file
	const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();

    const handleDeleteDialog = (open) => {
        setIsOpen(open);
    };

    // delete confirmation
    const handleIsDelete = async () => {
		try {
			await deleteFile({ id: item?.id }).unwrap();
		} catch (error) {
			toast.error(trans(error?.data?.error));
		}
	};

    return (
        <Paper
            className={`group/item relative rounded-lg overflow-hidden cursor-pointer border transition ease-out duration-200 ${
                selectedFiles.find((file) => file?.id === item?.id)
                    ? "border-gray-2 dark:border-gray-1"
                    : "border-white dark:border-dark-shade-1 hover:border-gray-2 hover:dark:border-gray-1"
            }`}
        >
            <div
                onClick={() => handleSelectItem(item)}
                className="flex gap-2 px-2.5 pt-2.5 pb-3.5"
            >
                <div>
                    <DocumentItemIcon />
                </div>
                <div>
                    <p className="text-gray-1 text-2xs font-medium">
                        {item?.created_at}
                    </p>

                    <p className="text-sm pt-1">
                        {item?.title?.length > 150
                            ? item?.title?.slice(0, 150) + "..."
                            : item?.title}
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
                <a href={item?.file_url}
					target="_blank"
					rel="noreferrer"
					download={item?.title}
					className="h-4"
				>
                    <button className="outline-none border-none text-gray-1 dark:text-white hover:text-[red]/80 dark:hover:text-gray-1">
                        <DownloadIcon color="currentColor" />
                    </button>
                </a>
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

export default DocsHistoryItem;
