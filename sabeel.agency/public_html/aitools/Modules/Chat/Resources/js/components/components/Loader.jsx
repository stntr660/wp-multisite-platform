{
	/***************************************************************************
	 * How to use Loader Component *

	*default small loader *
	<Loader className="before:dark:bg-dark-shade-2 before:bg-white" />;

	*medium loader*
	<Loader className="before:dark:bg-dark-shade-2 before:bg-white" $medium />;

 	******************************************************************************/
}

import styled from "styled-components";
const Loader = styled.div`
	position: relative;
	height: ${({ $medium }) => ($medium ? 30 : 24)}px;
	width: ${({ $medium }) => ($medium ? 30 : 24)}px;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	background: linear-gradient(
		129deg,
		#fff1bf 13.95%,
		#ec458d 35.2%,
		#e14591 42.29%,
		#c6469d 54.4%,
		#9a49b1 70.07%,
		#664cc9 86.05%
	);
	animation: animate 0.6s linear infinite;
	&::before {
		position: absolute;
		content: "";
		left: 50%;
		top: 50%;
		border-radius: 100%;
		box-sizing: border-box;
		height: ${({ $medium }) => ($medium ? 26 : 20)}px;
		width: ${({ $medium }) => ($medium ? 26 : 20)}px;
		transform: translate(-50%, -50%);
	}
	@keyframes animate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;

export default Loader;