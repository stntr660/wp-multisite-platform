import { useSelector } from "react-redux";
import CharacterAvatar from "./CharacterAvatar";
import HrzPositionWrapper from "./HrzPositionWrapper";
import TextCard from "./TextCard";

const ChatGreetings = () => {
	const { selectedAssistant } = useSelector((state) => state.assistants);
	if(!selectedAssistant) return null;
	return (
		<HrzPositionWrapper $align="left" className="mt-[14px] !flex-row">
			<CharacterAvatar
				avatar={selectedAssistant?.image_url}
				alt={selectedAssistant?.name}
			/>
			{selectedAssistant?.message ? (
				<TextCard>{selectedAssistant?.message}</TextCard>
			) : (
				<div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-11 w-full max-w-sm rounded-[10px]"></div>
			)}
		</HrzPositionWrapper>
	);
};

export default ChatGreetings;
