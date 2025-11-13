import styled from "styled-components";

const Sidebar = styled.nav`
	position: fixed;
	width: ${(props) => (props.open ? props.$sidebarWidth : 0)}px;
	height: 100%;
	transition: all 0.3s ease-out;
	transform: translateX(
		${(props) => (props.open ? 0 : -props.$sidebarWidth)}px
	);
	z-index: 500;
    margin-left: ${(props) => props.$mainNavWidth}px;
    @media (max-width: 640px) {
		width: ${(props) => (props.open ? `calc(100% - ${props.$mainNavWidth}px)` : 0)};
	};
`;
export default Sidebar;
