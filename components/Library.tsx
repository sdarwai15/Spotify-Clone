"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import { Song } from "@/types";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import useSubscribeModal from "@/hooks/useSubscribeModal";

import MediaItem from "./MediaItem";

interface LibraryProps {
	songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
	const authModal = useAuthModal();
	const uploadModal = useUploadModal();
	const subscribeModal = useSubscribeModal();
	const { user, subscription } = useUser();
	const onPlay = useOnPlay(songs);

	const onClick = () => {
		if (!user) {
			return authModal.onOpen();
		}

		if (!subscription) {
			return subscribeModal.onOpen();
		}

		return uploadModal.onOpen();
	};

	return (
		<div className="flex flex-col">
			<div
				className="
                    flex
                    justify-between
                    items-center
                    px-5
                    pt-4
                "
			>
				<div
					className="
                        inline-flex
                        items-center
                        gap-x-2
                    "
				>
					<TbPlaylist size={26} className="text-neutral-400" />
					<p
						className="
							text-neutral-400
							font-medium
							text-md
						"
					>
						Your Library
					</p>
				</div>
				<AiOutlinePlus
					onClick={onClick}
					size={20}
					className="
						text-neutral-400
						cursor-pointer
						hover:text-white
						transition
					"
				/>
			</div>
			<div
				className="
					flex
					flex-col
					gap-y-2
					mt-4
					px-3
				"
			>
				{songs.map((song) => {
					return (
						<MediaItem
							key={song.id}
							onClick={(id: string) => onPlay(id)}
							data={song}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Library;
