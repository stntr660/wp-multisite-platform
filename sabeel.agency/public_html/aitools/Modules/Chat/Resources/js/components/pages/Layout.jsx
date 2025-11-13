import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import ChatBot from "../components/ChatBot";
import MainNav from "../components/MainNav";
import MainNavBar from "../components/MainNavbar";
import useMediaQuery from "../hooks/useMediaQuery";
import WebHistory from "../components/WebHistory";
import HistoryDrawerContent from "../components/HistoryDrawerContent";
import { handleDocsDrawerOpen, handleHistoryDrawerOpen, handleWebDrawer } from "../store/slices/uiSlice";
import { Sidebar, HistoryDrawer, BodyContent, SideNav, DocumentHistory} from "../components";

const headerHeight = 58;
export const screens = {
    sm: 640,
    md: 768,
};

const Layout = () => {
    const dispatch = useDispatch();
    const { matches } = useMediaQuery({ maxWidth: 640 });
    const { matches: smallMatches } = useMediaQuery({ maxWidth: screens.sm }); // 428
    const { openHistoryDrawer, openDocsDrawer, openWebDrawer } = useSelector((state) => state.ui);
    const [mainNavOpen, setMainNavOpen] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarCollapse, setSidebarCollapse] = useState(false);
    const [mainNavWidth, setMainNavWidth] = useState(76);
    const [sidebarWidth, setSidebarWidth] = useState(270);
    const [historyWidth, setHistoryWidth] = useState(428); // 428
    const [docsHistoryWidth, setDocsHistoryWidth] = useState(428);

    const handleMainNav=() => {
        setMainNavOpen(!mainNavOpen);
    }

    const handleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarCollapse = () => {
        setSidebarCollapse(!sidebarCollapse);
    };

    const handleHistory = () => {
        dispatch(handleHistoryDrawerOpen());
		if (openDocsDrawer) {
			setTimeout(() => {
				dispatch(handleDocsDrawerOpen());
			}, 300);
		}
        if (openWebDrawer) {
			setTimeout(() => {
				dispatch(handleWebDrawer(false));
			}, 300);
		}
    };

    useEffect(() => {
        if (sidebarCollapse) {
            setSidebarWidth(76);
        } else {
            setSidebarWidth(270);
        }
    }, [sidebarCollapse]);

    useEffect(() => {
        if (smallMatches) {
            setSidebarCollapse(false);
        }
    }, [smallMatches]);

    useEffect(() => {
        if (smallMatches) {
            setMainNavOpen(false);
            setSidebarOpen(false);
        } else {
            setMainNavOpen(true);
            setSidebarOpen(true);
        }
    }, [smallMatches]);

    useEffect(() => {
        if (smallMatches) {
            setHistoryWidth(0);
            setDocsHistoryWidth(0);
        } else {
            setHistoryWidth(428);
            setDocsHistoryWidth(428);
        }
    }, [smallMatches]);


    return (
        <main className="flex h-screen">
             {/* aside/Main-drawer*/}
            <aside>
                <MainNavBar 
                open={mainNavOpen}
                $mainNavWidth={mainNavWidth}>
                    <MainNav />
                </MainNavBar>
            </aside>
            {/* aside/sidebar-drawer*/}
            <aside>
                <Sidebar
                    className="bg-bg-2 dark:bg-dark-shade-2 border-r border-r-gray-2 dark:border-r-clr47"
                    open={sidebarOpen}
                    $sidebarWidth={sidebarWidth}
                    $mainNavWidth={mainNavWidth}
                    $maxWidth={smallMatches}
                >
                    <SideNav
                        handleSidebarCollapse={handleSidebarCollapse}
                        handleSidebar={handleSidebar}
                        handleMainNav={handleMainNav}
                        sidebarCollapse={sidebarCollapse}
                        handleHistory={handleHistory}
                        headerHeight={headerHeight}
                        historyOpen={openHistoryDrawer}
                    />
                </Sidebar>
            </aside>
            {/* history-drawer */}
            <aside>
                <HistoryDrawer
                    className="bg-bg-2 dark:bg-dark-shade-2 border-r border-r-gray-2 dark:border-r-clr47"
                    $historyOpen={openHistoryDrawer}
                    $sidebarOpen={sidebarOpen}
                    $sidebarWidth={sidebarWidth}
                    $mainNavWidth={mainNavWidth}
                    $historyWidth={historyWidth}
                >
                    <HistoryDrawerContent
                        handleHistory={handleHistory}
                        headerHeight={headerHeight}
                    />
                </HistoryDrawer>
                {/* history of documents */}
				<HistoryDrawer
					className="bg-bg-2 dark:bg-dark-shade-2 border-r border-r-gray-2 dark:border-r-clr47"
					$historyOpen={openDocsDrawer}
                    $sidebarOpen={sidebarOpen}
                    $sidebarWidth={sidebarWidth}
                    $mainNavWidth={mainNavWidth}
					$historyWidth={docsHistoryWidth}
				>
					<DocumentHistory headerHeight={headerHeight} />
				</HistoryDrawer>
                {/* history of web */}
				<HistoryDrawer
					className="bg-bg-2 dark:bg-dark-shade-2 border-r border-r-gray-2 dark:border-r-clr47"
					$historyOpen={openWebDrawer}
					$sidebarOpen={sidebarOpen}
					$sidebarWidth={sidebarWidth}
					$mainNavWidth={mainNavWidth}
					$historyWidth={docsHistoryWidth}
				>
					<WebHistory headerHeight={headerHeight} />
				</HistoryDrawer>
            </aside>
            {/* body */}
            <BodyContent
                className="bg-bg-1 dark:bg-dark-bg"
                $historyOpen={openHistoryDrawer || openDocsDrawer || openWebDrawer}
                $sidebarOpen={sidebarOpen}
                $sidebarWidth={sidebarWidth}
                $mainNavWidth={mainNavWidth}
                $historyWidth={historyWidth}
            >
                <ChatBot
                    isHidden={smallMatches}
                    handleSidebar={handleSidebar}
                    headerHeight={headerHeight}
                    handleMainNav={handleMainNav}
                >
                    {<Outlet />}
                </ChatBot>
            </BodyContent>
        </main>
    );
};

export default Layout;
