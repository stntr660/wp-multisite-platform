import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnalyzeURL from "./AnalyzeURL";
import WebsiteChat from "./WebsiteChat";
import { setLayout } from "../../store/slices/uiSlice";
import { LAYOUT } from "../../constants/layout";

const Website = () => {
	const dispatch  = useDispatch();
	const { isWebTabSwitch } = useSelector((state) => state.web) || {};

	useEffect(() => {
		dispatch(setLayout(LAYOUT.WEB));
	}, [dispatch]);

	let render = null;

	if (isWebTabSwitch) {
		render = <WebsiteChat />;
	} else {
		render = <AnalyzeURL />;
	}

	return render;
};

export default Website;
