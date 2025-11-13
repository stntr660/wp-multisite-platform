import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toggleTheme } from "../store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import MainNavItems from "./ManinNavItems";
import useLangTranslation from "../hooks/useLangTranslation";

const MainNav = () => {
    const { theme } = useSelector((state) => state.theme);
    const [enabled, setEnabled] = useState(theme === "light" ? false : true);
    const dispatch = useDispatch();
    const { trans } = useLangTranslation();

    useEffect(() => {
        handleThemeChange();
    }, [enabled]);

    const handleThemeChange = () => {
        dispatch(toggleTheme());
    };

    return (
        <div className="h-full bg-white dark:bg-dark-shade-1 static pt-1.5 flex flex-col">
            <MainNavItems />
            <div className="mt-auto pl-2 h-[62px] flex items-center border-t border-t-gray-2 dark:border-t-clr47 mx-2">
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${enabled ? "bg-orange" : "bg-gray-2"}
                relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-1 border-gray-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                >
                    <span className="sr-only">{trans("Use setting")}</span>
                    <span
                        aria-hidden="true"
                        className={`${
                            enabled ? "translate-x-4" : "translate-x-0"
                        } 
                    pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
            </div>
        </div>
    );
};

export default MainNav;
