import { transformFileResponse } from "../../utils/transformResponse";
import { resetTempChat } from "../slices/chatSlice";
import { apiSlice } from "./apiSlice";

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getChatById: build.query({
            query: (conversationId) => `/v2/chats/${conversationId}`,
            transformResponse: (response) => transformFileResponse(response),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(resetTempChat());
                } catch (err) {
                    // `onError` side-effect
                }
            },
            providesTags: ["Chat"],
        }),
        getMoreChatById: build.query({
            query: ({ page, conversationId }) => `/v2/chats/${conversationId}?page=${page}`,
            transformResponse: (response) => transformFileResponse(response),

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
                                draft.pagination.nextPage = result.data.pagination.nextPage;
                                draft.pagination.next_page_url = result.data.pagination.next_page_url;
                                draft.pagination.currentPage = result.data.pagination.currentPage;
                            }
                        )
                    );
                } catch (error) {
                    /* empty */
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetChatByIdQuery } = chatApi;
