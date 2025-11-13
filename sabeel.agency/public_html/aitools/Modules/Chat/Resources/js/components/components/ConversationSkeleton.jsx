import HrzPositionWrapper from "./HrzPositionWrapper";
import Paper from "./Paper";

const ConversationSkeleton = () => {
    return (
        <div className="flex flex-col gap-5 h-full w-full mt-[14px]">
            <HrzPositionWrapper className="!flex-row">
				<div className="h-[42px] w-[42px] mr-3 rounded-full flex-shrink-0 bg-[#e3e3e3] dark:bg-dark-shade-1 animate-pulse"></div>
				<Paper className="px-2.5 py-2.5 rounded-lg transition ease-out duration-200 w-2/3 space-y-2">
					<div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
				</Paper>
			</HrzPositionWrapper>
            <HrzPositionWrapper $align="right">
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-lg transition ease-out duration-200 w-2/3 space-y-2">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper className="!flex-row">
                <div className="h-[42px] w-[42px] mr-3 rounded-full flex-shrink-0 bg-[#e3e3e3] dark:bg-dark-shade-1 animate-pulse"></div>
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-full space-y-2">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-2/3 rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-1/2 rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper $align="right">
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-full space-y-2 flex flex-col items-end">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-2/3 rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper className="!flex-row">
                <div className="h-[42px] w-[42px] mr-3 rounded-full flex-shrink-0 bg-[#e3e3e3] dark:bg-dark-shade-1 animate-pulse"></div>
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-full space-y-2">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-2/3 rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-1/2 rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper $align="right">
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-full space-y-2 flex flex-col items-end">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-2/3 rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-1/2 rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper className="!flex-row">
                <div className="h-[42px] w-[42px] mr-3 rounded-full flex-shrink-0 bg-[#e3e3e3] dark:bg-dark-shade-1 animate-pulse"></div>
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-2/3 space-y-2">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
            <HrzPositionWrapper $align="right">
                <Paper className="px-2.5 pt-2.5 pb-3.5 rounded-xl transition ease-out duration-200 w-full space-y-2 flex flex-col items-end">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-full rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-2/3 rounded-md"></div>
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2.5 w-1/2 rounded-md"></div>
                </Paper>
            </HrzPositionWrapper>
        </div>
    );
};

export default ConversationSkeleton;
