import styled from "styled-components";

const StyledCopyButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${({ $size }) => ($size === "small" ? "24px" : "32px")};
    width: ${({ $size }) => ($size === "small" ? "24px" : "32px")};
    border-radius: ${({ $size }) => ($size === "small" ? "4px" : "6px")};
    z-index: 1;
`;

const CopyButton = ({ icon, size = "medium", ...rest }) => {
	return (
		<StyledCopyButton
			{...rest}
			$size={size}
			className="flex items-center justify-center border border-gray-2 dark:border-clr47 bg-white dark:bg-dark-shade-1"
		>
			{icon}
		</StyledCopyButton>
	);
};

export default CopyButton;
