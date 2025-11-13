import { useSelector } from "react-redux";
import { ChatPanel, ConversationsPanel } from "../components";

const Chat = () => {
	const { isTabSwitch } = useSelector((state) => state.chat);

	if (isTabSwitch) {
		return <ConversationsPanel />;
	}

	return <ChatPanel />;
};

export default Chat;
