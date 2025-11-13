import { useDispatch } from "react-redux";
import Paper from "./Paper";
import { DownloadIcon } from "./icons";
import DocumentItemIcon from "./icons/DocumentItemIcon";
import { handleSelectedFiles } from "../store/slices/documentSlice";

const ConversationDocsItem = ({ file }) => {
    const dispatch = useDispatch();
    return (
        <div className="flex">
            <Paper className="relative rounded-lg overflow-hidden border sm:min-w-[340px] border-gray-2 dark:border-clr47">
                <div className="flex gap-2 px-2.5 pt-2.5 pb-3.5">
                    <div>
                        <DocumentItemIcon />
                    </div>
                    <div>
                        <p className="text-gray-1 text-2xs font-medium">
                            {file?.created_at}
                        </p>
                        <p className="text-sm pt-1">
                            {file?.title?.length > 150
                                ? file?.title?.slice(0, 150) + "..."
                                : file?.title}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 absolute right-2.5 top-2.5 z-50">
                    <a href={file?.file_url}
                        target="_blank"
                        rel="noreferrer"
                        download={file?.title}
                    >
                        <button className="outline-none border-none text-gray-1 hover:text-dark-1 hover:text-[red]/80 dark:hover:text-gray-2">
                            <DownloadIcon color="currentColor" />
                        </button>
                    </a>
                </div>
            </Paper>
            {file?.isRemove && (
                <button className="ml-1 self-start text-gray-1" onClick={() => dispatch(handleSelectedFiles(file))}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ConversationDocsItem;
