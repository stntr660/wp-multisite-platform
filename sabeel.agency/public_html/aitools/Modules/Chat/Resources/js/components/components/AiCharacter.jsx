import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Popover, Transition } from "@headlessui/react";
import Input from "./Input";
import Avatar from "./Avatar";
import Loader from "./Loader";
import { RefreshIcon } from "./icons";
import IconButton from "./IconButton";
import CharacterItem from "./CharacterItem";
import { useGetChatAssistantsQuery } from "../store/api/ChatAssistantsApi";
import { storeSelectedAssistant } from "../store/slices/ChatAssistantsSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const AiCharacter = () => {
	const { selectedAssistant } = useSelector((state) => state.assistants);
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const [assistants, setAssistants] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState("");

	const {
		data: chatAssistants,
		refetch,
		isLoading,
		isError,
	} = useGetChatAssistantsQuery();

	const handleChange = (e) => {
		if (e.target.value !== " ") {
			setSearchKeyword(e.target.value);
		}
	};

	// store chat assistants in local state
	useEffect(() => {
		if (!isLoading && chatAssistants?.data?.length) {
			setAssistants(chatAssistants?.data);
		}
	}, [chatAssistants?.data, isLoading]);

	// store selected chat assistants in redux store
	useEffect(() => {
		if (!isLoading && chatAssistants?.data?.length) {
			const defaultAssistant = chatAssistants?.data?.find(
				(item) => item?.is_default
			);
			if (defaultAssistant) {
				dispatch(storeSelectedAssistant(defaultAssistant));
			} else {
				dispatch(storeSelectedAssistant(chatAssistants?.data[0]));
			}
		}
	}, [chatAssistants?.data, dispatch, isLoading]);

	// filter chat assistants based on search keyword and store in local state
	useEffect(() => {
		if (!isLoading && chatAssistants?.data?.length) {
			const filteredAssistants = chatAssistants?.data?.filter((item) =>
				item?.name.toLowerCase().includes(searchKeyword.toLowerCase())
			);
			setAssistants(filteredAssistants);
		}
	}, [chatAssistants?.data, isLoading, searchKeyword]);

	let render = null;

	if (isError) {
		render = (
			<Container>
				<p className="mb-4 text-center my-2 text-dark-1 dark:text-white text-xs font-medium">
					{trans("Oops! Something went wrong. Please again refetch the AI Characters.")}
				</p>
				<IconButton
					onClick={refetch}
					icon={<RefreshIcon />}
					variant="text"
					bgColor="transparent"
				/>
			</Container>
		);
	}

	if (isLoading) {
		render = (
			<Container>
				<Loader className="before:dark:bg-dark-shade-1 before:bg-white" />
			</Container>
		);
	}

	if (!isLoading && !isError && assistants?.length === 0) {
		render = (
			<Container>
				<p className="mb-4 text-center my-2 text-dark-1 dark:text-white text-xs font-medium">
					{trans("No AI Characters found.")}
				</p>
			</Container>
		);
	}

	if (!isLoading && !isError && assistants?.length > 0) {
		render = assistants?.map((item, i) => (
			<Popover.Button key={item?.id} className="w-full">
				<CharacterItem
					i={i}
					title={item?.name}
					subtitle={item?.role}
					avatar={item?.image_url}
					bot_plan={item?.bot_plan}
					active={selectedAssistant?.id === item?.id}
					onClick={() => {
						return dispatch(storeSelectedAssistant(item)), setSearchKeyword("");
					}}
				/>
			</Popover.Button>
		));
	}

	return (
		<Popover className="w-fit h-[52px]">
			<>
				<Popover.Button className="outline-none">
					<Avatar assistants={selectedAssistant} />
				</Popover.Button>
				<Transition
					as={Fragment}
					enter="transition duration-200 ease-out"
					enterFrom="transform scale-0 opacity-100"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-200 ease-in"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-0 opacity-0"
				>
					<Popover.Panel className="absolute z-50 transform -translate-y-full px-0 origin-bottom-left -top-2">
						<div className="character-menu z-50 max-h-[444px]  w-[320px] md:w-[372px] bg-white dark:bg-dark-shade-1 shadow-input overflow-x-hidden flex flex-col border border-gray-1 rounded-lg">
							<div className="my-[12px] mx-4">
								<p className="my-2 text-dark-1 dark:text-white text-lg font-medium">
									{trans("AI Characters")}
								</p>
								<Input onChange={handleChange} value={searchKeyword} placeholder={trans("Search character")}/>
							</div>
							<div className="h-full overflow-y-auto mr-[3px]">{render}</div>
						</div>
					</Popover.Panel>
				</Transition>
			</>
		</Popover>
	);
};

export default AiCharacter;

const Container = ({ children }) => {
	return (
		<div className="min-h-[175px] h-full w-full flex flex-col items-center justify-center py-[14px] px-[15px]">
			{children}
		</div>
	);
};
