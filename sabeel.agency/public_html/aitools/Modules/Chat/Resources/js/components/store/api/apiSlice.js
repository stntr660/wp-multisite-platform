import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        // baseUrl: rootUrl,
        baseUrl: rootUrl.replace("/V1", ""),
        prepareHeaders: async (headers) => {
            const token = accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Chat", "Image", "File"],
    endpoints: () => ({}),
});
