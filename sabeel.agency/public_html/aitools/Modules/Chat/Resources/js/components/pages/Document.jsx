import { motion } from "framer-motion"; 
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { LAYOUT } from "../constants/layout";
import { useDispatch, useSelector } from "react-redux";
import ChipIconButton from "../components/ChipIconButton";
import { useUploadFileMutation } from "../store/api/fileUploadApi";
import { useAskQuestionMutation } from "../store/api/askQuestionApi";
import { handleDocTabSwitch, handleSelectedFiles } from "../store/slices/documentSlice";
import { handleHistoryDrawerOpen, setLayout, handleDocsDrawer, handleWebDrawer, stayDocWebChat} from "../store/slices/uiSlice";
import { DocumentConversationPanel, DocumentUpload, TabPanel, YourDocument } from "../components";
import useLangTranslation from "../hooks/useLangTranslation";

const Document = () => {
    const dispatch = useDispatch();
    const { isDocTabSwitch } = useSelector((state) => state.document);

    useEffect(() => {
        dispatch(setLayout(LAYOUT.DOCUMENT));
    }, []);

    if (isDocTabSwitch) {
        return <DocumentConversationPanel />;
    }

    return <DocumentFirstUi />;
};

export default Document;

const DocumentFirstUi = () => {
    const dispatch = useDispatch();
	const { trans } = useLangTranslation();
    const { openHistoryDrawer, openWebDrawer } = useSelector((state) => state.ui);
    const [clickOn, setClickOn] = useState("chat");
    const [files, setFiles] = useState([]);

    // ** File upload mutation
    const [
        uploadFile, 
        { 
            data: uploadFileResponse, 
            isLoading: isUploading, 
            isError: isFileUploadError,
            error: fileUploadError
        }
    ] = useUploadFileMutation();

    // ** Ask question mutation
	const [askQuestion] = useAskQuestionMutation();

	const removeFile = () => {
		setFiles([]);
	};

    // ** Handle file upload
    const handleFileUpload = async () => {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append("file[]", file);
		});
		formData.append("type", "file");
		uploadFile(formData);
	};

    const handleHistory = () => {
        dispatch(handleDocsDrawer(true))
		if (openHistoryDrawer) {
			setTimeout(() => {
				dispatch(handleHistoryDrawerOpen());
			}, 300);
		}
		if(openWebDrawer) {
			setTimeout(() => {
				dispatch(handleWebDrawer(false));
			}, 300);
		}
	};

    // ** Store uploaded file to selected files
	useEffect(() => {
		if (uploadFileResponse?.data) {
			dispatch(stayDocWebChat(true))

			const files = uploadFileResponse?.data.map((file) => {
				return {
					id: file.id,
					title: file.original_name,
					file_url: file?.file_url,
					created_at: file.created_at,
					isRemove: clickOn === "summarize" ? false : true,
				};
			});
			dispatch(handleSelectedFiles(files));
			dispatch(handleDocTabSwitch(true));

            // Ask question based on file upload
			if (clickOn === "summarize") {
				askQuestion({
					prompt: "Summarize",
					file_id: files?.map((file) => file.id),
					parent_id: null,
				});
			}
		}
	}, [uploadFileResponse, dispatch]);

    // ** Handle error
	useEffect(() => {
		if (isFileUploadError) {
			toast.error(fileUploadError?.data?.error ?? trans("File upload failed"));
		}
	}, [isFileUploadError, fileUploadError]);

    return (
        <TabPanel className="h-full flex flex-col items-center justify-center">
            {files?.length > 0 ? (
				<>
					<p className="text-center text-xl font-medium my-3 text-dark-1 dark:text-white">
						{trans("Your document")}
					</p>
					<p className="mb-8 max-w-md text-center text-sm text-gray-1">
						{trans("Let AI summarize the document for you or ask anything what you want to know about it.")}
					</p>
					<YourDocument 
                        files={files} 
                        clickOn={clickOn}
						setClickOn={setClickOn}
                        removeFile={removeFile} 
                        isUploading={isUploading}
                        handleFileUpload={handleFileUpload} 
                    />
				</>
			)  : (
                <motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.2,  }}
					className="flex flex-col items-center justify-center"
				>
                    <p className="text-center text-xl font-medium my-3 text-dark-1 dark:text-white">
                        {trans("Upload your document")}
                    </p>
                    <p className="mb-8 max-w-md text-center text-sm text-gray-1">
                        {trans("Note that we do not share any information provided in the documents to maintain data privacy.")}{" "}
                    </p>
                    <DocumentUpload setFiles={setFiles} />
                    {/* button/see all docs */}
                    <ChipIconButton
                        onClick={handleHistory}
                        className="mt-7"
                    >
                        {trans("See all docs")}
                    </ChipIconButton>
                </motion.div>
            )}
        </TabPanel>
    );
};
