import { ImageIcon } from "./icons";
import cn from "../utils/cn";
import Paper from "./Paper";
import HrzPositionWrapper from "./HrzPositionWrapper";

const ImageSkeleton = () => {
    return (
        <div className="space-y-3">
            <HrzPositionWrapper $align="right">
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-lg transition ease-out duration-200 w-[320px] space-y-2">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-4 w-full rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper className="w-full">
                <Paper className="p-2.5 rounded-[10px] w-full">
                    <Skeleton />
                </Paper>
            </HrzPositionWrapper>
        </div>
    );
};

export default ImageSkeleton;

const Skeleton = ({ className }) => {
    return (
        <div
            className={cn(
                "w-full rounded-b-lg image-skeleton-gradient h-[300px] sm:h-[576px] md:h-[576px] flex items-center justify-center animate-pulse",
                className
            )}
        >
            <ImageIcon />
        </div>
    );
};
