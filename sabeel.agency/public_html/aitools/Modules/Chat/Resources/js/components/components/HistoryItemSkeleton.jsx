import Paper from "./Paper";

const HistoryItemSkeleton = () => {
    return (
        <Paper className="px-2.5 pt-2 pb-3 rounded-lg">
            <div className="flex items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-4 w-14 rounded-sm"></div>
                    <div className="flex gap-2">
                        <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-4 w-4 rounded-sm"></div>
                        <div className="bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-4 w-20 rounded-sm"></div>
                    </div>
                </div>
                <div className="my-2 bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-4 w-4 rounded-sm"></div>
            </div>
            <div className="my-2 bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2 w-full rounded-sm"></div>
            <div className="my-2 bg-[#e3e3e3] dark:bg-[#222222] animate-pulse h-2 max-w-[300px] rounded-sm"></div>
        </Paper>
    );
};

export default HistoryItemSkeleton;
