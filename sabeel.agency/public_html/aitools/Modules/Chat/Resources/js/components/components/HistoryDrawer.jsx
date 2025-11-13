import styled from "styled-components";

const HistoryDrawer = styled.section`
    position: fixed;
    height: 100%;
    width: ${(props) => (props.$historyOpen ? props.$historyWidth : 0)}px;
    transition: all 0.3s ease-out;
    transform: translateX(
        ${(props) => (props.$historyOpen ? 0 : -props.$historyWidth)}px
    );

    top: 0;
    z-index: 5;

    left: ${({ $sidebarOpen, $historyOpen, $sidebarWidth, $mainNavWidth }) =>
        $sidebarOpen && $historyOpen
            ? $sidebarWidth + $mainNavWidth
            : $sidebarOpen && !$historyOpen
            ? $sidebarWidth + $mainNavWidth
            : !$sidebarOpen && $historyOpen
            ? 0
            : 0}px;

    @media (max-width: 700px) {
        width: ${(props) => (props.$historyOpen ? 365 : 0)}px;
    }

    @media (max-width: 640px) {
        z-index: 555;
        top: 0;
        left: 0;
        width: 100%;
        transform: translateX(${(props) => (props.$historyOpen ? 0 : "-100%")});
    }
`;
export default HistoryDrawer;