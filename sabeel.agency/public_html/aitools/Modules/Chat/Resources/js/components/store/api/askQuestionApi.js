import { apiSlice } from "./apiSlice";
import { CHAT_WITH } from "../../constants/type";
import { selectChat } from "../slices/chatSlice";
import { resetInitialDocChat, setInitialDocChat } from "../slices/documentSlice";
import { resetInitialWebChat, setInitialWebChat } from "../slices/webSlice";
import { docFakeBotMessage, docFakePatch, docFakeUserMessage } from "../../utils/fakePatch";
import { LAYOUT } from "../../constants/layout";

export const askQuestionApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		askQuestion: build.mutation({
			query: (body) => ({
				url: `/v2/resources/ask`,
				method: "POST",
				headers: {
					Accept: "application/json",
				},
				body,
			}),
			async onQueryStarted( { prompt, parent_id }, { dispatch, queryFulfilled, getState }
				) {
					const { layout } = getState().ui;
					
					// Optimistic update
					const fakePatch = docFakePatch(prompt)
					const patchResult = dispatch(
						apiSlice.util.updateQueryData( "getFileConversationById", parent_id, (draft) => {
							draft.data.push(fakePatch) }
						)
					);
	
					// Temporary store user_message: If there haven't parent_id / new conversation
					if (!parent_id) {
						layout === LAYOUT.DOCUMENT && dispatch(setInitialDocChat(docFakeUserMessage(prompt)));
						layout === LAYOUT.WEB && dispatch(setInitialWebChat(docFakeUserMessage(prompt)));
					}
	
					try {
						const { data } = await queryFulfilled;
						dispatch(selectChat({ id: Number(data?.data?.chat_id), type: layout === LAYOUT.DOCUMENT ? CHAT_WITH.DOCUMENT : CHAT_WITH.WEB }));
	
						// Temporary store bot_message: If there haven't parent_id / new conversation
						if (!parent_id) {
							layout === LAYOUT.DOCUMENT && dispatch(setInitialDocChat(docFakeBotMessage(data)));
							layout === LAYOUT.WEB && dispatch(setInitialWebChat(docFakeBotMessage(data)));
						}
					} catch {
						layout === LAYOUT.DOCUMENT && dispatch(resetInitialDocChat());
						layout === LAYOUT.WEB && dispatch(resetInitialWebChat());
						patchResult.undo();
					}
				},
			invalidatesTags: ["Chat", "File"],
		}),
	}),
	overrideExisting: false,
});

export const { useAskQuestionMutation } = askQuestionApi;
