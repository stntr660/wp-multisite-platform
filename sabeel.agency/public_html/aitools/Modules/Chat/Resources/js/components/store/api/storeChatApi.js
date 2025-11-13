import { apiSlice } from "./apiSlice";
import { CHAT_WITH } from "../../constants/type";
import { transformStoreChatResponse } from "../../utils/transformResponse";
import { resetTempChat, selectChat, storeTempChat } from "../slices/chatSlice";
import { chatFakePatch, fakeBotMessage, fakeUserMessage } from "../../utils/fakePatch";

export const storeChatApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        storeChat: build.mutation({
            query(body) {
                return {
					url: `/v2/chats`,
                    method: "POST",
                    body: {
						prompt: body.prompt,
						bot_id: body.botId,
						chat_id: body.conversationId,
						model: body.model,
					},
                };
            },
			transformResponse: (response) => transformStoreChatResponse(response),
            async onQueryStarted({ prompt, conversationId }, { dispatch, queryFulfilled }) {
				// Optimistic update
				const fakePatch = chatFakePatch(prompt)
				const patchResult = dispatch(
					apiSlice.util.updateQueryData('getChatById', conversationId, (draft) => {
					draft.data.push(fakePatch)
				  })
				)

				// Temporary store user_message: If there haven't conversationId / new conversation
				if(!conversationId) {
					dispatch(storeTempChat(fakeUserMessage(prompt)));
				}

				try {
				  	const { data } = await queryFulfilled;
					dispatch(selectChat({ id: Number(data?.id), type: CHAT_WITH.CHAT }));

					// Temporary store bot_message: If there haven't conversationId / new conversation
					if(!conversationId) {
						dispatch(storeTempChat(fakeBotMessage(data)));
					}
				} catch {
					dispatch(resetTempChat());
				  	patchResult.undo()
				}
			  },
            invalidatesTags: ["Chat"],
        }),
    }),
    overrideExisting: false,
});

export const { useStoreChatMutation } = storeChatApi;
