import { useState, useEffect, Fragment } from "react";
import {
    AccountIcon,
    DahboardNavIcon,
    DashboardIcon,
    GalleryNavIcon,
    HistoryIcon,
    ImageNavIcon,
    SpeechToTextNavIcon,
    VoiceOverIcon,
} from "./icons";
import HeadPhone from "./icons/HeadPhone";
import FolderIcon from "./icons/FolderIcon";
import GradientChatIcon from "./icons/GradientChatIcon";
import CodeNavIcon from "./icons/CodeNavIcon";
import { useGetUserAccessQuery } from "../store/api/userAccessApi";
import PenIcon from "./icons/PenIcon";
import { useGetPreferencesQuery } from "../store/api/preferencesApi";
import useLangTranslation from "../hooks/useLangTranslation";
import { BASE_MAIN_NAV_PATH } from "../utils/constants/basePath";

const MainNavItems = () => {
    const [adminControlMenu, setAdminControlMenu] = useState([]);
    const [historyUrl, setHistoryUrl] = useState("chat");

    const {
        data: preferences,
        isLoading: isPreferencesLoading,
        isSuccess: isPreferencesSuccess,
    } = useGetPreferencesQuery();

    const {
        data: userAccess,
        isSuccess: isUserAccessSuccess,
        isLoading: isUserAccessLoading,
        isError: isUserAccessError,
    } = useGetUserAccessQuery();

    // save company name & logo in local storage
    useEffect(() => {
        if (!isPreferencesLoading && isPreferencesSuccess) {
            localStorage.setItem(
                "companyName",
                preferences[0]?.company?.company_name
            );
            localStorage.setItem(
                "companyLogo",
                preferences[0]?.company?.company_icon
            );
        }
    }, [preferences, isPreferencesLoading, isPreferencesSuccess]);

    // manage admin control menu
    useEffect(() => {
        const menu = [
            {
                id: "template",
                title: "Prebuilt Templates",
                Icon: <DashboardIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/templates`,
            },
            {
                id: "long_article",
                title: "Long Article",
                Icon: <PenIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/articles/create`,
            },
            {
                id: "image",
                title: "Image Maker",
                Icon: <ImageNavIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/image`,
            },
            {
                id: "code",
                title: "Code Writer",
                Icon: <CodeNavIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/code`,
            },
            {
                id: "speech_to_text",
                title: "Speech to Text",
                Icon: <SpeechToTextNavIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/speech-to-text`,
            },
            {
                id: "text_to_speech",
                title: "Voiceover",
                Icon: <VoiceOverIcon />,
                url: `${BASE_MAIN_NAV_PATH}/user/text-to-speech`,
            },
            {
                id: "chat",
                title: "Chat",
                Icon: <GradientChatIcon />,
                url: `${BASE_MAIN_NAV_PATH}/chat`,
            },
        ];
        if (
            !isUserAccessLoading &&
            isUserAccessSuccess &&
            !isUserAccessError &&
            userAccess?.data
        ) {
            const filteredMenu = menu.filter((item) => {
                if (userAccess?.data) {
                    return !userAccess.data[`hide_${item.id}`];
                }
                return true;
            });

            setAdminControlMenu(filteredMenu);
        }
    }, [
        userAccess,
        isUserAccessError,
        isUserAccessLoading,
        isUserAccessSuccess,
    ]);

    // make history url
    useEffect(() => {
        adminControlMenu.map((menu) => {
            if (menu.title === "Prebuilt Templates") {
                return setHistoryUrl("user/documents");
            } else if (menu.title === "Long Article") {
                return setHistoryUrl("user/articles");
            } else if (menu.title === "Voiceover") {
                return setHistoryUrl("user/text-to-speech-list");
            } else if (menu.title === "Code Writer") {
                return setHistoryUrl("user/code-list");
            } else if (menu.title === "Speech to Text") {
                return setHistoryUrl("user/speech-list");
            }
        });
    }, [adminControlMenu]);

    return (
        <>
            <a href={routePath}>
                <NavItem
                    title={localStorage.getItem("companyName")}
                    Icon={
                        <img
                            src={localStorage.getItem("companyLogo") || "Modules/Chat/Resources/js/components/assets/images/logo-placeholder.svg"}
                            alt={
                                localStorage.getItem("companyName") || "Company"
                            }
                            className="w-8 h-8 rounded-full"
                        />
                    }
                />
            </a>
            <a href={`${BASE_MAIN_NAV_PATH}/user/dashboard`}>
                <NavItem title="Dashboard" Icon={<DahboardNavIcon />} />
            </a>

            {/* start -----------------> admin control menu */}
            {adminControlMenu?.length > 0 ? (
                <Fragment>
                    <div className="border-t  border-gray-2 dark:border-clr47 w-14 my-2 mx-2"></div>
                    {adminControlMenu.map((menu) => (
                        <a key={menu.title} href={menu.url}>
                            <NavItem title={menu.title} Icon={menu.Icon} />
                        </a>
                    ))}
                    <div className="border-t  border-gray-2 dark:border-clr47 w-14 my-2 mx-2"></div>
                </Fragment>
            ) : null}

            {/* History Menu*/}
            <Fragment>
                {adminControlMenu.some(
                    (menu) => menu.title === "Prebuilt Templates"
                ) ||
                adminControlMenu.some((menu) => menu.title === "Voiceover") ||
                adminControlMenu.some(
                    (menu) => menu.title === "Long Article"
                ) ||
                adminControlMenu.some((menu) => menu.title === "Code") ||
                adminControlMenu.some(
                    (menu) => menu.title === "Speech to Text"
                ) ? (
                    <Fragment>
                        <a href={BASE_MAIN_NAV_PATH + "/" + historyUrl}>
                            <NavItem title={"History"} Icon={<HistoryIcon />} />
                        </a>
                    </Fragment>
                ) : null}
            </Fragment>

            {/* Gallery Menu*/}
            <Fragment>
                {adminControlMenu.some(
                    (menu) => menu.title === "Image Maker"
                ) ? (
                    <Fragment>
                        <a href={`${BASE_MAIN_NAV_PATH}/user/image-gallery`}>
                            <NavItem
                                title={"Gallery"}
                                Icon={<GalleryNavIcon />}
                            />
                        </a>
                    </Fragment>
                ) : null}
            </Fragment>

            {adminControlMenu.some((menu) => menu.title !== "Chat") ? (
                <div className="border-t  border-gray-2 dark:border-clr47 w-14 my-2 mx-2"></div>
            ) : null}
            {/* end -----------------> admin control menu */}

            <a href={`${BASE_MAIN_NAV_PATH}/user/ticket/list`}>
                <NavItem title="Support Ticket" Icon={<HeadPhone />} />
            </a>
            <a href={`${BASE_MAIN_NAV_PATH}/user/folder/drive-${userId}`}>
                <NavItem title="Drive" Icon={<FolderIcon />} />
            </a>
            <a href={`${BASE_MAIN_NAV_PATH}/user/profile`}>
                <NavItem title="Account" Icon={<AccountIcon />} />
            </a>
        </>
    );
};

export default MainNavItems;

const NavItem = ({ title, Icon }) => {
    const { trans } = useLangTranslation();
    return (
        <button
            className={`group/item relative h-[52px] w-full flex items-center gap-3 justify-center  hover:bg-bg-1 dark:hover:bg-clr47 transition duration-200 ease-out  ${
                title == "Chat" && "gradient-border-r__active"
            }`}
        >
            <div className={`flex-shrink-0 align-center`}>{Icon}</div>
            <span
                className={`block invisible group-hover/item:visible dark:bg-white bg-clr47 dark:text-dark-1 text-white  rounded-md z-[700] px-2 py-[5px] font-medium text-xs absolute transition-all duration-200 ease-out opacity-0 group-hover/item:opacity-100 whitespace-nowrap left-[30px] group-hover/item:left-[60px]`}
            >
                {trans(title)}
            </span>
        </button>
    );
};
