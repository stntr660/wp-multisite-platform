import { useTranslation } from "react-i18next";

const useLangTranslation = () => {
    const { t: trans } = useTranslation();
    return {
        trans,
    };
};

export default useLangTranslation;
