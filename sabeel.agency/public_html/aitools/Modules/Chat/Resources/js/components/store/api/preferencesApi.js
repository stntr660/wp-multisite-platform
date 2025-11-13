import { apiSlice } from "./apiSlice";

export const preferencesApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getImgPreferences: build.query({
            query: () => `/V1/user/openai/preferences/image`,
        }),
        getProviders: build.query({
            query: () => `/V1/user/openai/preferences/providers`,
            transformResponse: (response) => response?.response?.records,
        }),
        getPreferences: build.query({
			query: () => `/V1/preferences`,
			transformResponse: (response) => response?.response?.records,
		}),
    }),
    overrideExisting: false,
});

export const { useGetImgPreferencesQuery, useGetProvidersQuery, useGetPreferencesQuery } = preferencesApi;
