
import { apiSlice } from "./apiSlice";

export const userAccessApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getUserAccess: build.query({
			query: () => `/v2/user-access`,
		}),
	}),
	overrideExisting: false,
});

export const { useGetUserAccessQuery } = userAccessApi;
