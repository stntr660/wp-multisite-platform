import TabPanel from "../components/TabPanel";
import useLangTranslation from "../hooks/useLangTranslation";

const NoPage = () => {
    const { trans } = useLangTranslation();
    return (
        <TabPanel className="h-full flex flex-col items-center justify-center">
            <h1 className="text-outline text-center text-white text-5xl font-bold [text-shadow:_3px_2px_3px_rgba(20_20_20_/_15%)]">
                {trans("404")}
            </h1>
            <p className="text-center mt-3 text-dark-1 dark:text-white">
                {trans("Oops! It seems you've taken a wrong turn")}
            </p>
        </TabPanel>
    );
};

export default NoPage;
