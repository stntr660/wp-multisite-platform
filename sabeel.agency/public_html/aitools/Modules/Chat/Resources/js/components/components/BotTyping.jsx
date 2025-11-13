import styled from "styled-components";

const StyledTypingAnimation = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    max-width: 80px;
    width: 100%;
    height: 39px;
    border-radius: 10px;
    overflow: hidden;
    .dot-1,
    .dot-2,
    .dot-3,
    .dot-4 {
        width: 8px;
        height: 8px;
        background: #898989;
        border-radius: 50%;
        animation: zooming 1s ease infinite;
    }
    .dot-1 {
        animation-delay: 0s;
    }
    .dot-2 {
        animation-delay: 0.2s;
    }
    .dot-3 {
        animation-delay: 0.3s;
    }
    .dot-4 {
        animation-delay: 0.5s;
    }
    @keyframes zooming {
        0% {
            transform: scale(0.25);
        }
        50% {
            transform: scale(1);
        }
        100% {
            transform: scale(0.25);
        }
    }
`;

const BotTyping = () => {
    return (
        <StyledTypingAnimation className="bg-white dark:bg-dark-shade-1">
            <div className="dot-1"></div>
            <div className="dot-2"></div>
            <div className="dot-3"></div>
            <div className="dot-4"></div>
        </StyledTypingAnimation>
    );
};

export default BotTyping;
