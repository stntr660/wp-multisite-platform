import { apiSlice } from "./apiSlice";

export const deleteChatApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        deleteChat: build.mutation({
            query({ id, type }) {
                return {
                    url: `/V1/user/openai/conversations?id=${id}&type=${type}`,
                    method: "DELETE"
                };
            },
            async onQueryStarted({ id, type }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getChatConversation",
                        undefined,
                        (draft) => {
                            draft.data = draft.data.filter(item => !(item.id === id && item.type === type));
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ["Chat"],
        }),
    }),
    overrideExisting: false,
});

export const { useDeleteChatMutation } = deleteChatApi;
