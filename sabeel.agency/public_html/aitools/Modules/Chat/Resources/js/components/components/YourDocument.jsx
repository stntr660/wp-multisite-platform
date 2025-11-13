import CloseIcon from "./icons/CloseIcon";
import { DocumentIcon } from "./icons";
import Button from "./Button";
import cn from "../utils/cn";
import useLangTranslation from "../hooks/useLangTranslation";

const YourDocument = ({ files, removeFile, isUploading, handleFileUpload, clickOn, setClickOn }) => {
	const { trans } = useLangTranslation();
	return (
		<div
			className={`relative w-full max-w-[352px] sm:min-w-[352px] flex flex-col items-center justify-center p-5 bg-white dark:bg-dark-shade-2 border-gray-1 rounded-xl`}
		>
			<button
				onClick={removeFile}
				className="absolute right-3 top-3 outline-none border-none"
			>
				<CloseIcon color="#898989" />
			</button>
			<span className="mt-[30px]">
				<DocumentIcon />
			</span>
			<ul className="mt-6 space-y-2">
				{files.map((item, idx) => (
					<li
						className={cn(
							"text-sm font-normal text-dark-1 dark:text-white break-all text-left",
							{
								"text-center": files?.length === 1,
							}
						)}
						key={item.name}
					>
						{files?.length > 1 && (
							<span className="mr-1 font-bold">{idx + 1}.</span>
						)}
						{item.name}
					</li>
				))}
			</ul>
			<div className="mt-[48px] flex items-center gap-3">
				<Button
					className="mt-6"
					dark
					onClick={() => {
						handleFileUpload();
						setClickOn("summarize");
					}}
					disabled={isUploading}
				>
					{isUploading && clickOn === "summarize" ? trans("Please wait") : trans("Summarize")}
				</Button>
				<Button
					className="mt-6"
					onClick={() => {
						handleFileUpload();
						setClickOn("chat");
					}}
					disabled={isUploading}
				>
					{isUploading && clickOn === "chat" ? trans("Please wait") : trans("Let's Chat")}
				</Button>
			</div>
		</div>
	);
};

export default YourDocument;
