import { useState, useEffect } from "react";
import cn from "../../utils/cn";
import { toast } from "react-toastify";
import { TabPanel } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { isValidURL } from "../../utils/isValidUrl";
import ChipIconButton from "../../components/ChipIconButton";
import { GlobeIcon, NavigateLinkIcon } from "../../components/icons";
import { useUploadFileMutation } from "../../store/api/fileUploadApi";
import { useAskQuestionMutation } from "../../store/api/askQuestionApi";
import { handleSelectedUrls, handleWebTabSwitch } from "../../store/slices/webSlice";
import { handleHistoryDrawerClose, handleWebDrawer, stayDocWebChat } from "../../store/slices/uiSlice";
import useLangTranslation from "../../hooks/useLangTranslation";

const AnalyzeURL = () => {
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const { openHistoryDrawer } = useSelector((state) => state.ui);
	const [url, setUrl] = useState("");
	const [clickOn, setClickOn] = useState("chat");

	// ** Ask question mutation
	const [askQuestion] = useAskQuestionMutation();

	// ** URL mutation
	const [
		analyzeURL,
		{
			data: analyzeURLResponse,
			isSuccess: isAnalyzingURLSuccess,
			isLoading: isAnalyzingURL,
			isError: isAnalyzingURLError,
			error: analyzingURLError,
		},
	] = useUploadFileMutation();

	const handleAnalyzingURL = (e) => {
		e.preventDefault();
		if (url === "") {
			return;
		} else if (!isValidURL(url)) {
			toast.warn(trans("The URL format is invalid. Please enter a valid URL."));
			return;
		} else {
			analyzeURL({ type: "url", url });
		}
	};

	const handleDrawer = () => {
		dispatch(handleWebDrawer(true))
		if (openHistoryDrawer){
			setTimeout(() => {
				dispatch(handleHistoryDrawerClose(false));
			}, 300);
			dispatch(handleWebDrawer(true))
		}
	};

	// ** Store uploaded file to selected files
	useEffect(() => {
		if (analyzeURLResponse?.data) {
			dispatch(stayDocWebChat(true))

			const files = analyzeURLResponse?.data.map((file) => {
				return {
					id: file.id,
					title: file.original_name,
					created_at: file.created_at,
					isRemove: clickOn === "analyze" ? false : true,
				};
			});
			dispatch(handleSelectedUrls(files));
			dispatch(handleWebTabSwitch(true));

			// ** Ask question based on url analysis
			if (clickOn === "analyze") {
				askQuestion({
					prompt: "Summarize",
					file_id: files?.map((file) => file.id),
					parent_id: null,
				});
			}
		}
	}, [analyzeURLResponse, dispatch, clickOn]);

	// ** Handle URL analysis success
	useEffect(() => {
		if (isAnalyzingURLSuccess) {
			setUrl("");
		}
	}, [isAnalyzingURLSuccess]);

	// ** Handle URL analysis error
	useEffect(() => {
		if (isAnalyzingURLError) {
			toast.error(
				analyzingURLError?.data?.error ??
					trans("An error occurred while analyzing URL")
			);
		}
	}, [isAnalyzingURLError, analyzingURLError]);

	return (
		<TabPanel className="h-full flex flex-col items-center justify-center">
			<p className="text-center text-xl font-medium my-3 text-dark-1 dark:text-white">
				{trans("Paste webpage link here")}
			</p>
			<p className="mb-8 max-w-md text-center text-sm text-gray-1">
				{trans("Share a web link, and let our AI delve into the content, providing relevant insights and opinions.")}
			</p>
			<form
				onSubmit={handleAnalyzingURL}
				className="w-full flex flex-col justify-center"
			>
				<div className="relative mx-auto w-full max-w-[580px] flex border border-gray-2 dark:border-clr47 hover:border-gray-1 hover:dark:border-gray-1 transition ease-out duration-200 rounded-xl overflow-hidden">
					<div className="bg-white dark:bg-dark-shade-1 w-[46px] flex items-center">
						<NavigateLinkIcon className="ml-3" />
						<div className="h-[22px] w-[1px] dark:bg-[#898989] bg-[#DFDFDF] ml-3"></div>
					</div>
					<input
						className="h-[48px] px-3 w-full outline-none bg-white dark:bg-dark-shade-1 focus:outline-none focus:ring-0 focus-visible:ring-0 text-sm font-light text-gray-1 dark:text-white placeholder:truncate placeholder:text-ellipsis placeholder:overflow-hidden"
						type="text"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder={trans("Enter site address here..")}
					/>
				</div>
				<br />
				<div className="flex flex-col items-center">
					{!isAnalyzingURL && (
						<div className="space-x-3">
							<button
								type="submit"
								disabled={url === ""}
								onClick={() => setClickOn("analyze")}
								className="mt-6 w-[130px] h-[40px] bg-dark-1 hover:bg-[#434343] rounded-[6px] font-medium text-[13px] text-center text-white transition-all ease-in-out duration-200 disabled:opacity-60"
							>
								{trans("Summarize")}
							</button>
							<button
								type="submit"
								disabled={url === ""}
								onClick={() => setClickOn("chat")}
								className="mt-6 w-[130px] h-[40px] bg-purple hover:bg-[#9163dd] rounded-[6px] font-medium text-[13px] text-center text-white transition-all ease-in-out duration-200 disabled:opacity-60"
							>
								{trans("Let's Chat")}
							</button>
						</div>
					)}
					{isAnalyzingURL && (
						<div className="mt-6 w-[130px] h-[40px] bg-purple rounded-[6px] font-medium text-[13px] text-center text-white flex justify-center items-center gap-[4px]">
							<div className="h-2 w-2 rounded-full bullet-bg-pulse-1"></div>
							<div className="h-2 w-2 rounded-full bullet-bg-pulse-2"></div>
							<div className="h-2 w-2 rounded-full bullet-bg-pulse-3"></div>
						</div>
					)}
					{false && (
						<div className="mt-5 mb-6">
							<p className="font-medium text-center text-gray-1 text-[13px] leading-[20px]">
								{trans("Analyzing the webpage..")}
							</p>
							<p className="font-medium text-center text-gray-1 text-[13px] leading-[20px]">
								{trans("Longer page may take some time, please wait.")}
							</p>
						</div>
					)}
					<ChipIconButton
						type="button"
						className={cn("mt-[86px]", {
							"mt-0": false,
						})}
						onClick={handleDrawer}
						icon={<GlobeIcon className="h-[16px] w-[16px]" />}
					>
						{trans("See all sites")}
					</ChipIconButton>
				</div>
			</form>
		</TabPanel>
	);
};

export default AnalyzeURL;
