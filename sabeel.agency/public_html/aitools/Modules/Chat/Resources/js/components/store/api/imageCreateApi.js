import { transformImageCreateResponse } from "../../utils/transformResponse";
import { resetInitialImage, setInitialImage } from "../slices/imageSlice";
import { imgFakePatch } from "../../utils/fakePatch";
import { selectChat } from "../slices/chatSlice";
import { CHAT_WITH } from "../../constants/type";
import { apiSlice } from "./apiSlice";

export const imageCreateApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		imageCreate: build.mutation({
			query(body) {
				return {
					url: `/V1/user/openai/image`,
					method: "POST",
					body,
				};
			},
			transformResponse: (response) => transformImageCreateResponse(response),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {

				const argObject = Object.fromEntries(arg.entries());
				const fakePatch = imgFakePatch(argObject);

				// Optimistic update
				const patchResult = dispatch(
					apiSlice.util.updateQueryData(
						"getImageConversationById",
						Number(argObject.parent_id),
						(draft) => {
							draft.data.push(fakePatch);
						}
					)
				);

				// Fake data for imageCreate: If there haven't argObject.parent_id
				if (!argObject.parent_id) {
					dispatch(setInitialImage(fakePatch));
				}

				try {
					const { data } = await queryFulfilled;
					if (!argObject.parent_id) {
						const fistIndex = 0;
						dispatch(
							selectChat({
								id: Number(data?.records?.imageUrls[fistIndex]?.id),
								type: CHAT_WITH.IMAGE,
							})
						);
					} else {
						dispatch(selectChat({ id: Number(argObject.parent_id), type: CHAT_WITH.IMAGE }));
					}
				} catch {
					dispatch(resetInitialImage());
					patchResult.undo();
				}
			},

			invalidatesTags: ["Image"],
		}),
	}),
	overrideExisting: false,
});

export const { useImageCreateMutation } = imageCreateApi;
