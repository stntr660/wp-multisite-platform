import Tooltip from "./Tooltip";
import { Fragment } from "react";
import FileSaver from "file-saver";
import IconButton from "./IconButton";
import CloseIcon from "./icons/CloseIcon";
import { Dialog, Transition } from "@headlessui/react";
import { CheckWhiteIcon, DownloadIcon, CopyWhiteIcon } from "./icons";
import useLangTranslation from "../hooks/useLangTranslation";

const ImageViewModal = ({ isOpen, closeModal, item, copied, handleCopyImage , copyImgId}) => {
	const { trans } = useLangTranslation();
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-[999]" onClose={() => {}}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-dark-1/50 backdrop-blur-[4px]" />
					</Transition.Child>
					{isOpen && (
						<div className="flex gap-2.5 fixed top-4 left-1/2 -translate-x-1/2 z-50">
							<span className="relative group/tooltip">
								<IconButton
									onClick={() => handleCopyImage(item?.imageUrl, item?.id)}
									icon={
										copied && item?.id === copyImgId ? <CheckWhiteIcon /> : <CopyWhiteIcon />
									}
									variant="img"
									className="!w-10 !h-10"
								/>
								<Tooltip title={trans("Copy")}/>
							</span>
							<span className="relative group/tooltip">
								<IconButton
									onClick={() =>
										FileSaver.saveAs(item?.imageUrl, item?.name)
									}
									icon={<DownloadIcon />}
									variant="img"
									className="!w-10 !h-10"
								/>
								<Tooltip title={trans("Download")}/>
							</span>
						</div>
					)}
					<div onClick={closeModal} className="fixed inset-0 overflow-y-auto">
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
								<Dialog.Panel className="pr-6 pt-3 max-w-4xl overflow-hidden align-middle transform transition-all">
									<div className="w-full flex justify-end">
										<IconButton
											icon={<CloseIcon />}
											variant="text"
											type="button"
											onClick={closeModal}
											className="absolute right-0 top-0"
										/>
									</div>
									<img
										src={item?.imageUrl}
										alt={item?.name}
										className="w-full h-full max-h-[calc(100vh-200px)]"
									/>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};
export default ImageViewModal;
