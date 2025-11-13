import Tooltip from "./Tooltip";
import FileSaver from "file-saver";
import IconButton from "./IconButton";
import MaximizeIcon from "./icons/MaximizeIcon";
import DeleteWhiteIcon from "./icons/DeleteWhiteIcon";
import { CheckWhiteIcon, CopyWhiteIcon, DownloadIcon } from "./icons";
import useLangTranslation from "../hooks/useLangTranslation";

const ImageHolder = ({
	item,
	setImage,
	copied,
	copyImgId,
	openModal,
	handleCopyImage,
	selectDeleteItem,
}) => {
	const { trans } = useLangTranslation();
	return (
		<span className="relative group/item w-full h-full">
			<img
				className="rounded-md"
				src={item?.imageUrl}
				alt={item?.name}
				height={item?.size?.split("x")[1]}
				width={item?.size?.split("x")[0]}
			/>
			<div className="absolute top-0 w-full p-3 flex gap-2 items-center justify-between invisible group-hover/item:visible -translate-y-3 group-hover/item:translate-y-0 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
				<span className="relative group/tooltip">
					{item?.parent_id && (
						<IconButton
							onClick={() => selectDeleteItem(item?.id)}
							icon={<DeleteWhiteIcon />}
							variant="img"
						/>
					)}
					<Tooltip title={trans("Delete")} />
				</span>
				<div className="flex gap-2 items-center">
					<span className="relative group/tooltip">
						<IconButton
							onClick={() => {
								setImage(item);
								openModal();
							}}
							icon={<MaximizeIcon />}
							variant="img"
						/>
						<Tooltip title={trans("View")} />
					</span>
					<span className="relative group/tooltip">
						<IconButton
							icon={
								copied && item?.id === copyImgId ? (
									<CheckWhiteIcon />
								) : (
									<CopyWhiteIcon />
								)
							}
							variant="img"
							onClick={() => handleCopyImage(item?.imageUrl, item?.id)}
						/>
						<Tooltip title={trans("Copy")} />
					</span>
					<span className="relative group/tooltip">
						<IconButton
							icon={<DownloadIcon />}
							variant="img"
							onClick={() => FileSaver.saveAs(item?.imageUrl, item?.name)}
						/>
						<Tooltip title={trans("Download")} />
					</span>
				</div>
			</div>
		</span>
	);
};

export default ImageHolder;
