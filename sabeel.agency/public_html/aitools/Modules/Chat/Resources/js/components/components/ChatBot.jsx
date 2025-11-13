import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "./Select";
import Container from "./Container";
import { toast } from "react-toastify";
import MultiSelect from "./MultiSelect";
import AiCharacter from "./AiCharacter";
import ImageUpload from "./ImageUpload";
import PromptInput from "./PromptInput";
import { MODEL } from "../constants/model";
import { LAYOUT } from "../constants/layout";
import ChipIconButton from "./ChipIconButton";
import ImageStylePopup from "./ImageStylePopup";
import { setArtStyles } from "../store/slices/imageSlice";
import { setModel } from "../store/slices/preferencesSlice";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { setPrompt } from "../store/slices/promptSlice";
import { ImageContext } from "../context/ImageContext";
import { clearSelectedFiles, handleDocTabSwitch } from "../store/slices/documentSlice";
import { useGetImgPreferencesQuery, useGetProvidersQuery } from "../store/api/preferencesApi";
import { DoubleForwardIcon, DoubleImageIcon, OptionIcon, RatioIcon, RestoreIcon, SparklerIcon } from "./icons";
import { handleIsTabSwitch, handleVisible, selectChat } from "../store/slices/chatSlice";
import { clearSelectedUrls, handleWebTabSwitch } from "../store/slices/webSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const ChatBot = ({ handleSidebar, headerHeight, children, handleMainNav }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
	const { trans } = useLangTranslation();
	const save = useContext(ImageContext);
    const { isConversationLoading, layout } = useSelector((state) => state.ui);
    const { preferences } = useSelector((state) => state.image) || {};
    const [hideStartNewButton, setHideStartNewButton] = useState(true);
    const [imgPreferences, setImgPreferences] = useState([]);
    const [openAiProviders, setOpenAiProviders] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    // ImgPreferences query
    const { data, isError: isPreferenceError, error: preferenceError, } = useGetImgPreferencesQuery();
   // Provider query
    const {data: providers, isError: isProviderError, error: providerError} = useGetProvidersQuery();

	// clear imageFile if provider is Openai
	useEffect(() => {
		if(preferences?.provider === "Openai" && save.imageFile){
			save.setImageFile(null)
		}
	}, [preferences?.provider, save]);

    // set openAiProviders
	useEffect(() => {
		if (providers?.openAI) {
			const openAi = Object.keys(providers?.openAI).map((item) => {
				return {
					name: providers?.openAI[item],
					value: item,
				};
			});
			setSelectedModel(openAi[0]);
			setOpenAiProviders(openAi);
		}
	}, [providers, dispatch]);

    // set model in redux
	useEffect(() => {
		if (selectedModel) {
			dispatch(setModel(selectedModel?.value));
		}
	}, [selectedModel, dispatch]);

    // set imageProviders
    useEffect(() => {
		if (data?.response?.records) {
			const { image_createFrom } = data?.response?.records ?? {};
			if (image_createFrom) {
				const providers = Object.keys(image_createFrom).map((item) => {
					return {
						name: image_createFrom[item],
						value: item,
					};
				});
				setImgPreferences((prev) => [
					...prev,
					{
						key: "provider",
						values: providers?.filter((item) => item?.name !== "Clipdrop"),
					},
				]);
			}
		}
	}, [data]);

    // set imgPreferences
	useEffect(() => {
		if (preferences?.provider && data?.response?.records) {
			let { model, ...preferenceData } = data?.response?.records[preferences?.provider] ?? {};
			const modifiedArray = Object.keys(preferenceData).map((item) => {
				return {
					key: item,
					values: preferenceData[item].map((value) => {
						return {
							value,
						};
					}),
				};
			});
			setImgPreferences((prev) => {
				const existingProvider = prev.filter(
					(item) => item?.key === "provider"
				);
				return [...existingProvider, ...modifiedArray];
			});
		}
	}, [data, preferences?.provider]);

    // set ArtStyle preferences in redux
	useEffect(() => {
		if (imgPreferences?.length) {
			const artStyle = imgPreferences?.find((item) => item?.key === "artStyle");
			dispatch(setArtStyles(artStyle?.values));
		}
	}, [imgPreferences, dispatch]);

	// handle useGetImgPreferencesQuery error
	useEffect(() => {
		if (isPreferenceError) {
			const { response } = preferenceError?.data || {};
			toast.error(
				response?.records ??
					response?.status?.message ??
					trans("Image preferences fetch failed, please refresh the page")
			);
		}
	}, [isPreferenceError, preferenceError]);

    // handle useGetProvidersQuery error
	useEffect(() => {
		if (isProviderError) {
			const { response } = providerError?.data || {};
			toast.error(
				Array.isArray(response?.records)
					? trans("Providers fetch failed, please refresh the page")
					: response?.records ??
							response?.status?.message ??
							trans("Providers fetch failed, please refresh the page")
			);
		}
	}, [isProviderError, providerError]);

    const handleStartNewChat = () => {
		dispatch(setPrompt(""));
		dispatch(selectChat(null));
		dispatch(clearSelectedFiles());
		dispatch(clearSelectedUrls());
        dispatch(handleVisible(true));
        dispatch(handleIsTabSwitch(false));
        dispatch(handleDocTabSwitch(false));
		dispatch(handleWebTabSwitch(false));
        navigate(BASE_ROUTE_PATH);
    };

    return (
        <div className="h-full flex flex-col">
            
            <button
                onClick={() => {
                    handleSidebar();
                    handleMainNav();
                }}
                className={`h-6 w-6 bg-dark-1 dark:bg-white p-[5px] rounded-[4px] text-white dark:text-dark-1 hidden menu-icon__btn fixed ml-2.5 mt-2.5 z-10`}
            >
                <div className="rotate-180">
                    <DoubleForwardIcon/>
                </div>
            </button>

            {/* body */}
            <div
                className={`w-full flex flex-col gap-2 pr-[3px] overflow-y-auto overflow-x-hidden`}
                style={{ height: `calc(100% - ${headerHeight}px)` }}
            >
                {children}
            </div>

            {/* footer */}
            <Container>
                <div className="relative mb-4 px-5">
                    <div className="absolute px-5 w-full transform  left-1/2 -translate-x-1/2 -translate-y-full origin-bottom flex items-center justify-center flex-wrap gap-2">
                        {layout === LAYOUT.IMAGE &&
                            imgPreferences?.map((item) => (
                                <MultiSelect
                                    key={item?.key}
                                    item={item}
                                    Icon={
                                        item?.key == "resulation" ? (
                                            <RatioIcon />
                                        ) : item?.key == "variant" ? (
                                            <DoubleImageIcon />
                                        ) : (
                                            <OptionIcon />
                                        )
                                    }
                                />
                            ))}
                        {(layout === LAYOUT.CHAT || layout === LAYOUT.CONVERSATION) && openAiProviders?.length && (
                            <Select
								Icon={<SparklerIcon />}
								items={openAiProviders}
								selected={selectedModel}
								setSelected={setSelectedModel}
                                centralize
							/>
                        )}
                        {layout !== LAYOUT.CHAT &&
                            !hideStartNewButton &&
                            !isConversationLoading && (
                                <ChipIconButton onClick={handleStartNewChat} icon={<RestoreIcon />}>
									{trans("Start New")}
								</ChipIconButton>
                            )}
                    </div>
                    <div className="relative pt-1.5 flex items-center gap-2">
                        { layout === LAYOUT.IMAGE && preferences?.provider?.toLowerCase() === MODEL.STABLE_DIFFUSION.toLowerCase() && <ImageUpload /> }
                        {/* It will be drop next after decision */}
						{/* { layout === LAYOUT.IMAGE ? <ImageStylePopup /> : <AiCharacter /> } */}
                        { (layout === LAYOUT.CHAT || layout === LAYOUT.CONVERSATION) && <AiCharacter /> }
                        <PromptInput setHideStartNewButton={setHideStartNewButton} />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ChatBot;
