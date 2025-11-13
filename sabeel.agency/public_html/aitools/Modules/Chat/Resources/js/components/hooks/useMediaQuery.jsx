import { useEffect, useState } from "react";

const useMediaQuery = ({ maxWidth }) => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= maxWidth) {
				setMatches(true);
			} else {
				setMatches(false);
			}
		};

		// Initial check on mount
		handleResize();

		// Attach event listener for resizing
		window.addEventListener("resize", handleResize);

		// Cleanup on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [maxWidth]); // Empty dependency array means this effect runs once on mount
	return { matches };
};

export default useMediaQuery;
