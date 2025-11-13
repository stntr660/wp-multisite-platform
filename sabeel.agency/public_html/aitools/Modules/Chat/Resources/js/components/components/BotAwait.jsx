import { useSelector } from "react-redux";
import BotTyping from "./BotTyping";
import CharacterAvatar from "./CharacterAvatar";
import HrzPositionWrapper from "./HrzPositionWrapper";

const BotAwait = ({ isAvatar = true }) => {
	const { selectedAssistant } = useSelector((state) => state.assistants);
	return (
		<HrzPositionWrapper className="!flex-row">
			{
				isAvatar && <CharacterAvatar
					avatar={selectedAssistant?.image_url}
					alt={selectedAssistant?.name}
				/>
			}
			<BotTyping />
		</HrzPositionWrapper>
	);
};

export default BotAwait;
