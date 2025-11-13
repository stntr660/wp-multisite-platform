import { apiSlice } from "./apiSlice";
import { LAYOUT } from "../../constants/layout";
import { resetInitialWebChat } from "../slices/webSlice";
import { resetInitialDocChat } from "../slices/documentSlice";
import { transformFileResponse } from "../../utils/transformResponse";

export const fileConversationByIdApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getFileConversationById: build.query({
			query: (id) => `/v2/conversation/${id}`,
			transformResponse: (response) => transformFileResponse(response),
			async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
				const { layout } = getState().ui;
				try {
					await queryFulfilled;
					if (layout === LAYOUT.DOCUMENT) {
						dispatch(resetInitialDocChat());
					}
					if(layout === LAYOUT.WEB) {
						dispatch(resetInitialWebChat());
					}
				} catch (err) {
					// `onError` side-effect
				}
			},
			providesTags: ["File"],
		}),

		getMoreFileConversationById: build.query({
			query: ({ page, id }) => `/v2/conversations/${id}?page=${page}`,
			transformResponse: (response) => transformFileResponse(response),
			async onQueryStarted(
				{ id },
				{ dispatch, queryFulfilled }
			) {
				try {
					const result = await queryFulfilled;
					dispatch(
						apiSlice.util.updateQueryData(
							"getFileConversationById",
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

export const { useGetFileConversationByIdQuery } = fileConversationByIdApi;
