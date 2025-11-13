import { selectChat } from "../slices/chatSlice";
import { deleteSelectedFileById } from "../slices/documentSlice";
import { deleteSelectedUrlsById } from "../slices/webSlice";
import { apiSlice } from "./apiSlice";

export const deleteFileApi = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		deleteFile: build.mutation({
			query({ id }) {
				return {
					url: `/v2/embed-resources/${id}`,
					method: "DELETE",
				};
			},
			async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
				const { layout } = getState().ui;
				const patchResult = dispatch(
					apiSlice.util.updateQueryData("getFiles", { type: layout === 'document' ? 'file' : 'url' }, (draft) => {
						draft.data = draft.data.filter((item) => item.id !== id);
					})
				);
				if (layout === 'document') {
					dispatch(deleteSelectedFileById(id));
				}else {
					dispatch(deleteSelectedUrlsById(id));
				}
				dispatch(selectChat(null));
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: ["File"],
		}),
	}),
	overrideExisting: false,
});

export const { useDeleteFileMutation } = deleteFileApi;
