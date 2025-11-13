import styled from "styled-components";

const StyledButton = styled.button`
	background: ${(props) => (props.dark ? "#141414" : "#763CD4")};
	transition: all 0.2s ease-out;
	&:hover {
		background: ${(props) => (props.dark ? "#434343" : "#9163dd")};
	}
`;

const Button = ({ children, ...arg }) => {
	return (
		<StyledButton
			{...arg}
			className={`py-2.5 px-8 rounded-md text-white text-xs`}
		>
			{children}
		</StyledButton>
	);
};

Button.defaultProps = {
	label: "Button",
	color: "purple",
};

export default Button;
