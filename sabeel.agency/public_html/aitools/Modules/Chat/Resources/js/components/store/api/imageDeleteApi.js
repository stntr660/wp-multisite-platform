import { apiSlice } from "./apiSlice";

export const imageDeleteApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		imageDelete: build.mutation({
			query(body) {
				return {
					url: `/V1/user/openai/image/delete`,
					method: "DELETE",
					body,
				};
			},
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						apiSlice.util.updateQueryData("getImageList", undefined, (draft) => {
							const index = draft.response.data.findIndex((item) => item.id === arg?.id);
							draft.response.data.splice(index, 1);
						})
					);
				} catch {
					/* empty */
				}
			},
			invalidatesTags: ["Image"],
		}),
	}),
	overrideExisting: false,
});

export const { useImageDeleteMutation } = imageDeleteApi;
