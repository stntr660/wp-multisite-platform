import { Fragment, useState, useEffect } from "react";
import Input from "./Input";
import Avatar from "./Avatar";
import ImageStyleItem from "./ImageStyleItem";
import { useDispatch, useSelector } from "react-redux";
import { Popover, Transition } from "@headlessui/react";
import { updatePreferences } from "../store/slices/imageSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const animeImg = "https://images.unsplash.com/photo-1578632749014-ca77efd052eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const threeDImg = "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ImageStylePopup = () => {
	const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const { artStyles: rawArtStyles, preferences } = useSelector((state) => state.image) || {};
	const [index, setIndex] = useState(0);
	const [artStyles, setArtStyles] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState("");

	const handleChange = (e) => {
		if (e.target.value !== " ") {
			setSearchKeyword(e.target.value);
		}
	};

	// set raw art styles in local state from redux store
	useEffect(() => {
		if (rawArtStyles?.length) {
			setArtStyles(rawArtStyles);
		}
	}, [rawArtStyles]);

	// filter art styles based on search keyword and store in local state
	useEffect(() => {
		if (rawArtStyles?.length) {
			const filteredArtStyles = rawArtStyles?.filter((item) =>
				item?.value.toLowerCase().includes(searchKeyword.toLowerCase())
			);
			setArtStyles(filteredArtStyles);
		}
	}, [rawArtStyles, searchKeyword]);

	// render content based on art styles
	let content = null;

	if (artStyles?.length) {
		content = (
			<div className="px-4 mt-1.5 mb-3 mr-[3px] h-full overflow-y-auto grid gap-x-3 gap-y-[5px] grid-cols-2">
				{artStyles?.map((item, idx) => (
					<Popover.Button
						key={item?.value}
						onClick={() =>{
							dispatch( updatePreferences({ key: "artStyle", value: item?.value }))
							setIndex(idx)
						}}
					>
						<ImageStyleItem
							title={item?.value}
							avatar={idx % 2 === 0 ? animeImg : threeDImg}
							isChecked={preferences?.artStyle === item?.value?.toLowerCase()}
							// isPremium
						/>
					</Popover.Button>
				))}
			</div>
		);
	}

	if (!artStyles?.length) {
		content = (
			<Container>
				<p className="mb-4 text-center my-2 text-dark-1 dark:text-white text-xs font-medium">
					{trans("No image styles found.")}
				</p>
			</Container>
		);
	}

	return (
		<Popover className="w-fit h-[52px]">
			<>
				<Popover.Button className="outline-none">
					<Avatar assistants={{ 
						image: index % 2 === 0 ? animeImg : threeDImg, 
						artStyles: preferences?.artStyle 
					}} />
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
						<div className="max-h-[444px] w-[320px] md:w-[372px]  bg-white dark:bg-dark-shade-1 shadow-input overflow-x-hidden flex flex-col border border-gray-1 rounded-lg">
							<div className="my-[12px] mx-4">
								<p className="my-2 text-dark-1 dark:text-white text-lg font-medium">
									{trans("Image Style")}
								</p>
								<Input onChange={handleChange} value={searchKeyword}  placeholder="Search style"/>
							</div>
							{content}
						</div>
					</Popover.Panel>
				</Transition>
			</>
		</Popover>
	);
};
export default ImageStylePopup;

const Container = ({ children }) => {
	return (
		<div className="min-h-[110px] h-full w-full flex flex-col items-center justify-center py-[14px] px-[15px]">
			{children}
		</div>
	);
};
