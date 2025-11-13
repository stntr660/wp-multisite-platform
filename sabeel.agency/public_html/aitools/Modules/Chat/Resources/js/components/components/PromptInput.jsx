import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendIcon } from "./icons";
import { toast } from "react-toastify";
import { LAYOUT } from "../constants/layout";
import { useNavigate } from "react-router-dom";
import { promptProcess } from "../utils/promptProcess";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import useAutoSizeTextArea from "../hooks/useAutoSizeTextArea";
import useKeyboardShortcutKey from "../hooks/useKeyboardShortcutKey";
import { useStoreChatMutation } from "../store/api/storeChatApi";
import { useImageCreateMutation } from "../store/api/imageCreateApi";
import { useAskQuestionMutation } from "../store/api/askQuestionApi";
import { handleIsTabSwitch, setChatPage } from "../store/slices/chatSlice";
import { setPrompt } from "../store/slices/promptSlice";
import { stayDocWebChat } from "../store/slices/uiSlice";
import { ImageContext } from "../context/ImageContext";
import useLangTranslation from "../hooks/useLangTranslation";

const PromptInput = ({ setHideStartNewButton }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { trans } = useLangTranslation();

    const file = useContext(ImageContext);
    const { prompt } = useSelector((state) => state.prompt);
    const { layout } = useSelector((state) => state.ui);
    const { selectedUrl } = useSelector((state) => state.web);
    const { selectedFiles } = useSelector((state) => state.document);
    const { preferences } = useSelector((state) => state.image) || {};
    const { model } = useSelector((state) => state.preferences);
    const { selectedAssistant } = useSelector((state) => state.assistants);
    const { selectedChat, isTabSwitch, chatPage } = useSelector((state) => state.chat);
    const [isDisabled, setIsDisabled] = useState(true);
    const textAreaRef = useRef(null);
    const focus = useKeyboardShortcutKey(textAreaRef)

    // ** Store chat mutation
    const [storeChat, { isLoading, isError, error }] = useStoreChatMutation();

    // ** Image create mutation
    const [ imageCreate, { isLoading: imageCreating, isError: isImageCreateError, error: imageCreateError}] = useImageCreateMutation();

    // ** Ask question mutation
    const  [ askQuestion, { isLoading: isAsking,  isError:  isAskError, error: askError }] = useAskQuestionMutation();

    const handlePromptChange = (e) => {
        dispatch(setPrompt(e.target?.value));
    };

    // Begin handle prompt submit
    const handleSubmitPrompt = (e) => {
        e.preventDefault();
        promptProcess(
            layout,
            storeChat,
            prompt,
            selectedAssistant,
            selectedChat,
            setPrompt,
            model,
            isTabSwitch,
            dispatch,
            handleIsTabSwitch,
            setChatPage,
            chatPage,
            imageCreate,
            preferences,
            file,
            askQuestion,
            selectedFiles,
            selectedUrl,
            stayDocWebChat,
        )
    };

    const handleSubmitPromptWithKeyPress = (e) => {
        if (prompt.length && e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            promptProcess(
                layout,
                storeChat,
                prompt,
                selectedAssistant,
                selectedChat,
                setPrompt,
                model,
                isTabSwitch,
                dispatch,
                handleIsTabSwitch,
                setChatPage,
                chatPage,
                imageCreate,
                preferences,
                file,
                askQuestion,
                selectedFiles,
                selectedUrl,
                stayDocWebChat
            )
        }
    };
    // End handle prompt submit

    useAutoSizeTextArea(textAreaRef.current, prompt);

    // start shortcut key to focus the textarea
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                textAreaRef.current.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (prompt.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [prompt]);

    useEffect(() => {
        if (prompt.length > 0) {
            dispatch(handleIsTabSwitch(true));
        }
    }, [prompt, dispatch]);

    // start handle switch tab when selected files or url is empty
    useEffect(() => {
		if(
            selectedFiles.length === 0 && 
            selectedChat === null &&
            layout === LAYOUT.DOCUMENT && 
            prompt.length > 0
        ) {
			dispatch(handleIsTabSwitch(true));
			navigate(BASE_ROUTE_PATH);
		}
	},[selectedFiles, layout, prompt, dispatch, navigate])

    useEffect(() => {
		if(
            selectedUrl.length === 0 && 
            selectedChat === null &&
            layout === LAYOUT.WEB && 
            prompt.length > 0
        ) {
			dispatch(handleIsTabSwitch(true));
			navigate(BASE_ROUTE_PATH);
		}
	},[selectedUrl, layout, prompt, dispatch, navigate])
    // end handle switch tab when selected files or url is empty

    useEffect(() => {
        setHideStartNewButton(isLoading);
    }, [isLoading]);

   // handle store chat error
	useEffect(() => {
		if (isError) {
			toast.error(error?.data?.error ?? trans("Message sending failed!"));
		}
	}, [isError, error]);

    // handle image create error
    useEffect(() => {
        if (isImageCreateError) {
            const { response } = imageCreateError?.data || {};
            toast.error(
                response?.records?.response ??
                    response?.status?.message ??
                    trans("Image creation failed!")
            );
        }
    }, [isImageCreateError, imageCreateError]);

    // handle document/web chat error
	useEffect(() => {
		if (isAskError) {
            toast.error(askError?.data?.error ?? `${trans(layout)} trans(chat failed!)`);
		}
	}, [isAskError, askError]);

    return (
        <form onSubmit={handleSubmitPrompt} className="w-full">
            <div className="relative flex border border-gray-2 dark:border-clr47 hover:border-gray-1 hover:dark:border-gray-1 transition ease-out duration-200 rounded-3xl overflow-hidden">
                <textarea
                    className="w-full pl-4 pr-12 py-[16px] resize-none outline-none bg-white dark:bg-dark-shade-1 focus:outline-none focus:ring-0 focus-visible:ring-0 text-sm font-normal rounded-xl placeholder:text-gray-1 placeholder:truncate placeholder:text-ellipsis placeholder:overflow-hidden text-dark-1 dark:text-white"
                    id="chat-textarea"
                    onChange={handlePromptChange}
                    onKeyDown={handleSubmitPromptWithKeyPress}
                    placeholder={`Type your prompts & commands ${
                        focus ? "" : "(ctrl+k)"
                    }`}
                    ref={textAreaRef}
                    rows={1}
                    value={prompt}
                    autoFocus
                    style={{ maxHeight: "200px" }}
                />
                <button
                    className="gradient-3 absolute right-1 bottom-[5px] flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-l transition ease-out duration-200 opacity-80 hover:opacity-100 focus:outline-none focus:ring-0 focus-visible:ring-0 disabled:opacity-60"
                    disabled={isDisabled || isLoading}
                >
                    <SendIcon />
                </button>
            </div>
        </form>
    );
};

export default PromptInput;
