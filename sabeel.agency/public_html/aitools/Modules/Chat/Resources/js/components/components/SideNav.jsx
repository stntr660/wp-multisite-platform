import { NavLink, useLocation } from "react-router-dom";
import { screens } from "../pages/Layout";
import ArrowBackIcon from "./icons/ArrowBackIcon";
import useMediaQuery from "../hooks/useMediaQuery";
import { BASE_ROUTE_PATH } from "../utils/constants/basePath";
import { setPrompt } from "../store/slices/promptSlice";
import { handleHistoryDrawerClose } from "../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleIsTabSwitch, handleVisible, selectChat } from "../store/slices/chatSlice";
import {
    FileIcon,
    LogoutIcon,
    MessageIcon,
    InsertImage,
    DoubleForwardIcon,
    MenuHistoryIcon,
    GlobeIcon,
} from "./icons";
import { clearSelectedFiles, handleDocTabSwitch } from "../store/slices/documentSlice";
import { clearSelectedUrls, handleWebTabSwitch } from "../store/slices/webSlice";
import useLangTranslation from "../hooks/useLangTranslation";

const navItems = [
    {
        to: BASE_ROUTE_PATH,
        title: "Chat",
        Icon: <MessageIcon />,
    },
    {
        to: `${BASE_ROUTE_PATH}/image`,
        title: "Image",
        Icon: <InsertImage />,
    },
    {
        to: `${BASE_ROUTE_PATH}/document`,
        title: "Document",
        Icon: <FileIcon />,
    },
    {
        to: `${BASE_ROUTE_PATH}/web`,
        title: "Web",
        Icon: <GlobeIcon />,
    },
    {
        title: "History",
        Icon: <MenuHistoryIcon />,
    },
];

const SideNav = ({
    handleSidebarCollapse,
    handleSidebar,
    handleMainNav,
    sidebarCollapse,
    handleHistory,
    historyOpen,
    headerHeight,
}) => {
    const { matches } = useMediaQuery({ maxWidth: screens.sm });
    const { openHistoryDrawer } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const { trans } = useLangTranslation();

    const handleNavbars = () => {
        handleSidebar();
        handleMainNav();
    };

    const handleOnClick = () => {
        dispatch(setPrompt(""));
        dispatch(selectChat(null));
		dispatch(clearSelectedFiles());
		dispatch(clearSelectedUrls());
        dispatch(handleVisible(true));
        dispatch(handleIsTabSwitch(false));
        dispatch(handleDocTabSwitch(false));
		dispatch(handleWebTabSwitch(false));
        if (openHistoryDrawer) {
            dispatch(handleHistoryDrawerClose(false));
        }
    }

    return (
        <div className="h-full">
            <div
                className={`pl-5 pr-4 border-b border-b-gray-2 dark:border-b-clr47 h-[58px] flex ${
                    sidebarCollapse ? "justify-center" : "justify-between"
                } items-center`}
            >
                {!sidebarCollapse && (
                    <span className="text-xl font-bold text-dark-1 dark:text-white whitespace-nowrap">
                        {trans("AI Chat")}
                    </span>
                )}
                <button
                    onClick={matches ? handleNavbars : handleSidebarCollapse}
                    className={`h-6 w-6 bg-dark-1 dark:bg-white p-[5px] rounded-[4px] text-white dark:text-dark-1`}
                >
                    <div
                        className={`transform transition duration-200 ease-out ${
                            sidebarCollapse ? "rotate-180" : "rotate-0"
                        }`}
                    >
                        <DoubleForwardIcon />
                    </div>
                </button>
            </div>
            <div
                className={`flex flex-col gap-2`}
                style={{ height: `calc(100% - ${headerHeight}px)` }}
            >
                <div className="py-5">
                    {navItems.map((item) => (
                        <NavLink 
                            to={item.to && item.to}
                            key={item.title}
                            onClick={() => item.title !== "History" && handleOnClick()}
                        >
                            <NavItem
                                title={item.title}
                                Icon={item.Icon}
                                isBasic={item.isBasic}
                                sidebarCollapse={sidebarCollapse}
                                handleHistory={handleHistory}
                                historyOpen={historyOpen}
                                handleNavbars={handleNavbars}
                                matches={matches}
                            />
                        </NavLink>
                    ))}
                </div>

                {/* logout section*/}
                <div className="pl-5 pr-4 mt-auto h-[62px] flex items-center border-t border-t-gray-2 dark:border-t-clr47">
                    <a href={logout} rel="noopener noreferrer">
                        <button className="flex gap-3">
                            <LogoutIcon />
                            {!sidebarCollapse && (
                                <span className="text-dark-1 dark:text-white text-15 font-normal">
                                    {trans("Logout")}
                                </span>
                            )}
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const NavItem = ({
    Icon,
    title,
    isBasic,
    handleHistory,
    sidebarCollapse,
    historyOpen,
    matches,
    handleNavbars,
    isActive,
}) => {
    const location = useLocation();
    const { trans } = useLangTranslation();
    const activeLink = location.pathname.split("/").pop();

    return (
        <button
            onClick={
                title === "History"
                    ? handleHistory
                    : matches
                    ? handleNavbars
                    : () => {}
            }
            className={`relative group/item h-[48px] w-full flex items-center gap-3 pl-5 pr-4 hover:bg-white dark:hover:bg-clr47 transition duration-200 ease-out ${
                activeLink == title.toLowerCase()
                    ? "bg-white dark:bg-clr47 gradient-border-r__active"
                    : "gradient-border-r"
            } ${sidebarCollapse ? "justify-center" : "justify-start"}`}
        >
            <div className="flex-shrink-0">{Icon}</div>
            {!sidebarCollapse && (
                <>
                    <span className="text-dark-1 dark:text-white text-15 whitespace-nowrap">
                        {trans(title)}
                    </span>
                    {isBasic && (
                        <p className="ml-auto text-right h-5 flex items-center bg-gold py-1 px-[7px] rounded-xl text-[11px] font-medium text-dark-1">
                            {trans("Basic")}
                        </p>
                    )}
                    {title === "History" && (
                        <div
                            className={`ml-auto ${
                                historyOpen
                                    ? "rotate-0 transform transition"
                                    : "rotate-180 transform transition"
                            }`}
                        >
                            <ArrowBackIcon />
                        </div>
                    )}
                </>
            )}
            {/* tooltip */}
            {sidebarCollapse && (
                <span
                    className={`block invisible group-hover/item:visible dark:bg-white bg-clr47 dark:text-dark-1 text-white rounded-md z-[700] px-2 py-[5px] font-medium text-xs absolute transition-all duration-200 ease-out opacity-0 group-hover/item:opacity-100 whitespace-nowrap left-10 group-hover/item:left-14`}
                >
                    {trans(title)}
                </span>
            )}
        </button>
    );
};
