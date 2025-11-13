import { transformResponse } from "../../utils/transformResponse";
import { resetInitialImage } from "../slices/imageSlice";
import { apiSlice } from "./apiSlice";

export const imageConversationByIdApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getImageConversationById: build.query({
			query: (id) => `/V1/user/openai/image/conversations/${id}`,
			transformResponse: (response) => transformResponse(response),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(resetInitialImage());
				} catch (err) {
					// `onError` side-effect
				}
			},
			providesTags: ["Image"],
		}),

		getMoreImageConversationById: build.query({
			query: ({ page, id }) => `/V1/user/openai/image/conversations/${id}?page=${page}`,
			transformResponse: (response) => transformResponse(response),
			async onQueryStarted(
				{ id },
				{ dispatch, queryFulfilled }
			) {
				try {
					const result = await queryFulfilled;
					dispatch(
						apiSlice.util.updateQueryData(
							"getImageConversationById",
							id,
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

export const { useGetImageConversationByIdQuery } = imageConversationByIdApi;
