import styled from "styled-components";

// gradient border with radius
const StyledGradientBorder = styled.div`
	background: linear-gradient(
		129deg,
		#fff1bf 13.95%,
		#ec458d 35.2%,
		#e14591 42.29%,
		#c6469d 54.4%,
		#9a49b1 70.07%,
		#664cc9 86.05%
	);
	padding: 1rem;
	border-radius: 8px;
`;

const GradientBorder = () => {
	return (
		<StyledGradientBorder>
			<div className="bg-dark-1 p-2 rounded-lg">h</div>
		</StyledGradientBorder>
	);
};

export default GradientBorder;
