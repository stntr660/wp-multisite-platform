import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Image from "./pages/Image";
import NoPage from "./pages/NoPage";
import Layout from "./pages/Layout";
import Document from "./pages/Document";
import "react-toastify/dist/ReactToastify.css";
import Website from "./pages/website/Website";
import { ToastContainer } from "react-toastify";
import LinearProgress from "./components/LinearProgress";
import { BASE_HOST_PATH } from "./utils/constants/basePath";
import { ImageContext } from "./context/ImageContext";
import { LAYOUT } from "./constants/layout";
import { handleDocsDrawer, handleWebDrawer } from "./store/slices/uiSlice";
import i18n from './languages/i18n';

const THEME_TYPES = { THEME_DARK: "dark", THEME_LIGHT: "light" };

const App = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const { layout } = useSelector((state) => state.ui);
    const [isReady, setIsReady] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const { THEME_DARK, THEME_LIGHT } = THEME_TYPES;
        const isDark = theme === THEME_DARK;
        document.documentElement.classList.remove(
            isDark ? THEME_LIGHT : THEME_DARK
        );
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Drawer handlers
    useEffect(() => {
		if (layout !== LAYOUT.WEB) {
			dispatch(handleWebDrawer(false));
		}
		if (layout !== LAYOUT.DOCUMENT) {
			dispatch(handleDocsDrawer(false));
		}
	}, [layout]);

    setTimeout(() => {
        setIsReady(true);
    }, 3500);

    // Set language
    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    if (!isReady) {
        return (
            <div>
                <LinearProgress />
            </div>
        );
    }

    return (
        <div>
            <BrowserRouter>
                <ImageContext.Provider
                    value={{ imageFile: imageFile, setImageFile: setImageFile }}
                >
                    <Routes>
                        <Route path={`${BASE_HOST_PATH}/`} element={<Layout />}>
                            <Route index element={<Chat />} />
                            <Route path="image" element={<Image />} />
                            <Route path="web" element={<Website />} />
                            <Route path="document" element={<Document />} />
                            <Route path="history" element={<History />} />
                            <Route path="*" element={<NoPage />} />
                        </Route>
                    </Routes>
                </ImageContext.Provider>
            </BrowserRouter>
            <ToastContainer
                theme={theme}
                closeOnClick={false}
                hideProgressBar={true}
                newestOnTop
                autoClose={3000}
                pauseOnFocusLoss
                toastClassName={"dark:bg-dark-shade-1 bg-white rounded-lg"}
                bodyClassName={() =>
                    "toastify flex items-center text-gray-1 dark:text-white text-sm font-medium p-3"
                }
            />
        </div>
    );
};

export default App;
