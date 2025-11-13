import { LAYOUT } from "../constants/layout";

export function promptProcess(
    layout,
    storeChat,
    prompt,
    selectedAssistant,
    selectedChat,
    setPrompt,
    model,
    isTabSwitch,
    dispatch,
    handleIsTabSwitch,
    setChatPage,
    chatPage,
    imageCreate,
    preferences,
    file,
    askQuestion,
    selectedFiles,
    selectedUrl,
    stayDocWebChat
) {
    if (layout === LAYOUT.CHAT || layout === LAYOUT.CONVERSATION) {
        storeChat({
            prompt: prompt,
            botId: selectedAssistant?.id,
            conversationId: selectedChat?.id,
            model,
        });
        if (!isTabSwitch) dispatch(handleIsTabSwitch(true));
        if (chatPage > 1) {
            dispatch(setChatPage(1));
        }
    } else if (layout === LAYOUT.IMAGE) {
        const formData = new FormData();
		formData.append("promt", prompt);
		Object.keys(preferences)?.forEach((key) => {
			formData.append(key, preferences[key]);
		});
		if (selectedChat?.id) {
			formData.append("parent_id", selectedChat?.id);
		}
		if (file?.imageFile) {
			formData.append("file", file?.imageFile);
		}
		imageCreate(formData);
    } else if (layout === LAYOUT.DOCUMENT) {
        dispatch(stayDocWebChat(true))
        askQuestion({
            prompt: prompt,
            file_id: selectedFiles?.map((file) => file.id),
            parent_id: selectedChat?.id ?? null,
        });
    }else if (layout === LAYOUT.WEB) {
        dispatch(stayDocWebChat(true))
		askQuestion({
			prompt: prompt,
			file_id: selectedUrl?.map((url) => url.id),
			parent_id: selectedChat?.id ?? null,
		});
	}
    dispatch(setPrompt(""));
}
