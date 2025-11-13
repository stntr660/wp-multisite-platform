export const transformResponse = (response) => {

    let nextPage = null;
	if ( response?.response?.records?.links?.next ) {
		nextPage = parseInt(response?.response?.records?.links?.next?.split("=")[1]);
	}else {
		nextPage = null;
	}

    return {
        data: response?.response?.records?.data,
        pagination: {
            currentPage: response?.response?.records?.meta?.current_page,
            next_page_url: response?.response?.records?.links?.next,
            lastPage: response?.response?.records?.meta?.last_page,
            perPage: response?.response?.records?.meta?.per_page,
            total: response?.response?.records?.meta?.total,
            nextPage,
        },
    };
};

export const transformFileResponse = (response) => {
	let nextPage = null;
	if (response?.links?.next) {
		nextPage = parseInt(response?.links?.next?.split("=")[1]);
	}else {
		nextPage = null;
	}
	return {
		data: response?.data,
		pagination: {
			currentPage: response?.meta?.current_page,
			next_page_url: response?.links?.next,
			lastPage: response?.meta?.last_page,
			perPage: response?.meta?.per_page,
			total: response?.meta?.total,
			nextPage,
		},
	};
};

export const transformStoreChatResponse = (response) => {
	const { chat_id, created_at, meta, bot_details } = response?.data || {};
	return {
		id: chat_id,
		botMessage: meta?.bot_reply,
		botImage: bot_details?.image_url,
		botDetails: bot_details,
		created: created_at
	};
};

export const transformImageCreateResponse = (response) => {
    return {
        records: response?.response?.records,
    };
};

export const transformImageListResponse = (response) => {
    return {
        response: response?.response?.records,
    };
};
