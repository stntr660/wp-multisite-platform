import Paper from "./Paper";
import { RestoreIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

const RegenerateWithPagination = () => {
	return (
		<Paper className="flex items-center justify-center border border-gray-2 dark:border-clr47 bg-white dark:bg-dark-shade-1 rounded-[6px] h-[32px] px-2 gap-2">
			<button className="mr-1">
				<RestoreIcon />
			</button>
			<button>
				<ChevronLeftIcon />
			</button>
			<span>1/1</span>
			<button>
				<ChevronRightIcon />
			</button>
		</Paper>
	);
};

export default RegenerateWithPagination;
