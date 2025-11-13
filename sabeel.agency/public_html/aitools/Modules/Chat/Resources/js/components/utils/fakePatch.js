import { v4 as uuidv4 } from "uuid";

export function imgFakePatch(arg) {
	return {
		isFake: true,
		parent_id: arg.parent_id,
		id: uuidv4(),
		user: "",
		originalName: "",
		imageUrl: "",
		name: arg.promt,
		slug: "",
		size: arg.resulation,
		artStyle: arg.artStyle,
		lightingStyle: arg.lightingStyle,
		created_at: new Date().toISOString(),
	};
}

export function chatFakePatch(prompt) {
	return {
		isTemp: true,
		id: uuidv4(),
		meta: { user_reply: prompt },
		bot_name: null,
		bot_message: null,
		created_at: new Date().toISOString(),
	};
}

export function fakeUserMessage(prompt) {
	return {
		id: uuidv4(),
		user_name: "Agatha Williams",
		user_message: prompt,
		bot_name: null,
		bot_message: null,
		created_at: new Date().toISOString(),
	}
}

export function fakeBotMessage(data) {
	return {
		id: uuidv4(),
		user_name: null,
		user_message: null,
		bot_name: null,
		bot_message: data?.botMessage,
		bot_image: data?.botImage,
		created_at: data?.created,
	}
}

export function docFakePatch(prompt) {
	return {
		isTemp: true,
		id: uuidv4(),
		created_at: new Date().toISOString(),
		meta: {
			user_reply: prompt
		}
	};
}

export function docFakeUserMessage(prompt) {
	return {
		id: uuidv4(),
		created_at: new Date().toISOString(),
		meta: {
			user_reply: prompt
		}
	};
}

export function docFakeBotMessage(data) {
	return {
		id: uuidv4(),
		created_at: new Date().toISOString(),
		meta: {
			bot_reply: data?.data?.meta?.bot_reply
		}
	};
}