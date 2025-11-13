import styled from "styled-components";

const MainNavBar = styled.nav`
	position: fixed;
    height: 100%;
    width: ${(props)=> props.$mainNavWidth}px !important;
    z-index: 550;
    display: ${(props)=> props.open ? 'block' : 'none'};
`;
export default MainNavBar;
