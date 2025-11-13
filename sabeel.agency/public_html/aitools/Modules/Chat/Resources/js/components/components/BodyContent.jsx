import styled from "styled-components";

const BodyContent = styled.main`
	flex: 1;
	height: 100%;
	overflow: auto;
	transition: margin-left 0.3s ease-in-out;
	overflow: hidden;

	margin-left: ${({
		$sidebarOpen,
		$historyOpen,
		$sidebarWidth,
		$historyWidth,
        $mainNavWidth
	}) =>
		$sidebarOpen && $historyOpen
			? $sidebarWidth + $historyWidth + $mainNavWidth
			: $sidebarOpen && !$historyOpen
			? $sidebarWidth + $mainNavWidth
			: !$sidebarOpen && $historyOpen
			? $historyWidth + $mainNavWidth
			: 0}px;

	@media (max-width: 1024px) {
		margin-left: ${({ $sidebarWidth , $mainNavWidth}) => $sidebarWidth + $mainNavWidth}px;
	}
	@media (max-width: 640px) {
		margin-left: 0;
	}
`;

export default BodyContent;
