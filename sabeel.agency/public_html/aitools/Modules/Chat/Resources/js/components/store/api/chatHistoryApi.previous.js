import { transformResponse } from "../../utils/transformResponse";
import { resetTempChat } from "../slices/chatSlice";
import { apiSlice } from "./apiSlice";

export const chatHistoryApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getChatHistory: build.query({
            query: (conversationId) =>
                `/V1/user/openai/chat/history/${conversationId}`,
            transformResponse: (response) => transformResponse(response),
            async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(resetTempChat());
                } catch (err) {
                    // `onError` side-effect
                }
            },
            providesTags: ["Chat"],
        }),
        getMoreChatHistory: build.query({
            query: ({ page, conversationId }) =>
                `/V1/user/openai/chat/history/${conversationId}?page=${page}`,
            transformResponse: (response) => transformResponse(response),

            async onQueryStarted(
                { conversationId },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        apiSlice.util.updateQueryData(
                            "getChatHistory",
                            conversationId,
                            (draft) => {
                                draft.data.push(...result.data.data);
                            }
                        )
                    );
                } catch (error) {}
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetChatHistoryQuery } = chatHistoryApi;
