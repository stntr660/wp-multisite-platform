import { transformResponse } from "../../utils/transformResponse";
import { storeLastChat } from "../slices/chatSlice";
import { apiSlice } from "./apiSlice";

export const chatConversationApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getChatConversation: build.query({
			query: () => `/V1/user/openai/conversations?page=1`,
			transformResponse: (response) => transformResponse(response),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const result = await queryFulfilled;
				const { id, type } = result?.data?.data[0] || {};
				dispatch(storeLastChat({ id: Number(id), type }));
			},

			providesTags: ["Chat", "Image"],
		}),
		getMoreConversation: build.query({
			query: (page) => `/V1/user/openai/conversations?page=${page}`,
			transformResponse: (response) => transformResponse(response),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						apiSlice.util.updateQueryData(
							"getChatConversation",
							undefined,
							(draft) => {
								draft.data.push(...result.data.data);
							}
						)
					);
				} catch (error) {
					/* empty */
				}
			},
		}),
	}),
	overrideExisting: false,
});

export const { useGetChatConversationQuery } = chatConversationApi;
