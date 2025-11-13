
import styled from "styled-components";

const StyledLinearProgress = styled.div`
	width: 100%;
	height: 3px;
	background: linear-gradient(268deg, #E60C84 -27.7%, #FFFFFF 1.84%);;
	position: fixed;
	overflow: hidden;
	border-radius: 2px;
	z-index: 999;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 0%;
		height: 100%;
		background: #ff5722;
		animation: progress 1s linear infinite;
	}
	@keyframes progress {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
		}
	}
`;

const LinearProgress = () => {
	return <StyledLinearProgress/>;
};

export default LinearProgress;

