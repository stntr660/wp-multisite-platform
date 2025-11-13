import { NavigateLinkIcon } from "./icons";
import { useDispatch } from "react-redux";
import { handleSelectedUrls } from "../store/slices/webSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const ConversationWebItem = ({ file }) => {
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	return (
		<div className="flex">
			<div className="flex gap-2 bg-white dark:bg-dark-shade-1 p-2.5 rounded-[10px] max-w-[888px] w-full height-[62px] border border-gray-2 dark:border-clr47">
				<NavigateLinkIcon className="flex-shrink-0" />
				<div>
					<p className="font-medium text-[12px] leading-[18px] text-gray-1 mb-[2px]">
						{trans("Web")}
					</p>
					<a
						href={file?.title}
						target="_blank"
						rel="noreferrer"
					>
						<p className="text-purple dark:text-yellow font-normal text-sm line-clamp-2 break-all">
							{file?.title}
						</p>
					</a>
				</div>
			</div>
			{file?.isRemove && (
				<button className="ml-1 self-start text-gray-1" onClick={() => dispatch(handleSelectedUrls(file))}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
				</button>
			)}
		</div>
	);
};

export default ConversationWebItem;
