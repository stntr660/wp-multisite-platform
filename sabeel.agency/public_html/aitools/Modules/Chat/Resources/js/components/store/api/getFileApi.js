import { transformFileResponse } from "../../utils/transformResponse";
import { apiSlice } from "./apiSlice";

export const getFileApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getFiles: build.query({
			query: ({ type }) => `/v2/embed-resources?type=${type}`,
			transformResponse: (response) => transformFileResponse(response),
			providesTags: ["File"],
		}),
		getMoreFiles: build.query({
			query: ({ page, type }) =>
				`/v2/embed-resources?page=${page}&type=${type}`,
			transformResponse: (response) => transformFileResponse(response),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						apiSlice.util.updateQueryData("getFiles", undefined, (draft) => {
							draft.data.push(...result.data.data);
						})
					);
				} catch (error) {
					/* empty */
				}
			},
		}),
	}),
	overrideExisting: false,
});

export const { useGetFilesQuery } = getFileApi;
