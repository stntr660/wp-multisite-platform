import { Fragment } from "react";
import IconButton from "./IconButton";
import Spinner from "./icons/Spinner";
import DarkCloseIcon from "./icons/DarkCloseIcon";
import { Dialog, Transition } from "@headlessui/react";
import useLangTranslation from "../hooks/useLangTranslation";

const ChatDeleteDialog = ({
	title,
	isOpen,
	isLoading,
	handleDeleteDialog,
	handleIsDelete,
}) => {
	const { trans } = useLangTranslation();
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-[999]"
					onClose={() => handleDeleteDialog(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-dark-1/50 backdrop-blur-[2px]" />
					</Transition.Child>
					<div
						onClick={() => handleDeleteDialog(false)}
						className="fixed inset-0 overflow-y-auto"
					>
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-0"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-50"
							>
								<Dialog.Panel className="bg-white dark:bg-dark-shade-1 max-w-[352px] w-full p-3 overflow-hidden rounded-xl align-middle transform transition-all">
									<div className="w-full flex justify-end">
										<IconButton
											icon={<DarkCloseIcon />}
											variant="text"
											type="button"
											onClick={() => handleDeleteDialog(false)}
											className="absolute right-3 top-3"
										/>
									</div>
									<Dialog.Title className="mt-3 mb-8 px-5 text-dark-1 dark:text-white text-normal sm:text-xl font-medium">
										{title}
									</Dialog.Title>
									<div className="mb-2 flex gap-4">
										<button
											onClick={handleIsDelete}
											disabled={isLoading}
											className="relative flex items-center justify-center gap-2 py-2 px-8 w-full text-sm font-medium text-white dark:text-white bg-purple hover:bg-purple/90 disabled:bg-purple/90 rounded-md transition duration-200 ease-in-out"
										>
											<span>{isLoading ? "Deleting" : "Delete"}</span>
											{isLoading && (
												<span className="absolute w-full h-full flex items-center justify-center backdrop-blur-[1px] rounded-md">
													<Spinner />
												</span>
											)}
										</button>
										<button
											onClick={() => handleDeleteDialog(false)}
											className="py-2 px-8 w-full text-sm font-medium text-white dark:text-white bg-dark-1 hover:bg-dark-1/90 dark:bg-clr47 dark:hover:bg-clr47/60 rounded-md transition duration-200 ease-in-out"
										>
											{trans("No")}
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};
export default ChatDeleteDialog;
