import styled from "styled-components";

const HrzPositionWrapper = styled.div`
    width: 100%;
    max-width: calc(100% - 72px);
    align-self: ${({ $align }) =>
        $align === "right" ? "flex-end" : "flex-start"};
    display: flex;
    justify-content: ${({ $align }) =>
        $align === "right" ? "flex-end" : "flex-start"};
    flex-direction: ${({ $align }) => ($align === "right" ? "row" : "column")};

    @media (max-width: 640px) {
		max-width: calc(100% - 34px);
	}
`;

export default HrzPositionWrapper;
