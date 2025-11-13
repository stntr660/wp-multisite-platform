import styled from "styled-components";
import { ImageIcon } from "./icons";
import cn from "../utils/cn";

const StyledWidth = styled.div`
    width: 100%;
    max-width: 512px;
`;

const ImageCreatingSkeleton = ({ className }) => {
    return (
        <StyledWidth>
            <div
                className={cn(
                    "relative rounded-b-lg image-skeleton-gradient h-[316px] w-full flex items-center justify-center animate-pulse",
                    className
                )}
            >
                <div className="absolute top-0 w-full">
                    <div className="linear-progressbar"></div>
                </div>
                <ImageIcon />
            </div>
        </StyledWidth>
    );
};

export default ImageCreatingSkeleton;
