import { apiSlice } from "./apiSlice";

export const chatAssistantsApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getChatAssistants: build.query({
			query: () => `/v2/chat/bots`,
		}),
	}),
	overrideExisting: false,
});

export const { useGetChatAssistantsQuery } = chatAssistantsApi;
