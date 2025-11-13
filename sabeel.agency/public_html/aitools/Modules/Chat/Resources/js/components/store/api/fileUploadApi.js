import { apiSlice } from "./apiSlice";

export const fileUploadApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		uploadFile: build.mutation({
			query: (body) => ({
				url: `/v2/embed-resources`,
				method: "POST",
				headers: {
					Accept: "application/json",
				},
				body,
			}),
			invalidatesTags: ["File"],
		}),
	}),
	overrideExisting: false,
});

export const { useUploadFileMutation } = fileUploadApi;
