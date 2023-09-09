"use client";

import uniqid from "uniqid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";

const UploadModal = () => {
    const router = useRouter();
    const { user } = useUser();
	const uploadModal = useUploadModal();
	const supabaseClient = useSupabaseClient();
	const [isLoading, setIsLoading] = useState(false);

	const { register, handleSubmit, reset } = useForm<FieldValues>({
		defaultValues: {
			author: "",
			title: "",
			song: null,
			image: null,
		},
	});

	const onChange = (open: boolean) => {
		if (!open) {
			reset();
			uploadModal.onClose();
		}
	};

	const onSubmit: SubmitHandler<FieldValues> = async (values) => {
		try {
			setIsLoading(true);

			const imageFile = values.image?.[0];
			const audioFile = values.song?.[0];

			if (!imageFile || !audioFile || !user) {
				toast.error("Missing fields!");
				return;
			}

			const uniqueID = uniqid();

            const {
                data: songData,
                error: songError
            } = await supabaseClient.storage
				.from("songs")
				.upload(`${values.title}-song-${uniqueID}`, audioFile, {
					cacheControl: "3600",
					upsert: false,
				});

			if (songError) {
				setIsLoading(false);
				return toast.error("Failed to upload song!");
			}

            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient.storage
					.from("images")
					.upload(`${values.title}-image-${uniqueID}`, imageFile, {
						cacheControl: "3600",
						upsert: false,
					});

			if (imageError) {
				setIsLoading(false);
				return toast.error("Failed to upload image!");
            }
            
            const {
                error: supabaseError,
            } = await supabaseClient.from("songs").insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData?.path,
                song_path: songData?.path,
            });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            setIsLoading(false);
            toast.success("Song uploaded!");
            uploadModal.onClose();
            router.refresh();
            reset();
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			title="Add a song"
			description="Upload an mp3 file to add to your library."
			isOpen={uploadModal.isOpen}
			onChange={onChange}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
				<Input
					id="title"
					disabled={isLoading}
					{...register("title", { required: true })}
					placeholder="song title"
				/>
				<Input
					id="author"
					disabled={isLoading}
					{...register("author", { required: true })}
					placeholder="song author"
				/>
				<div>
					<div className="pb-1">Select a song file!</div>
					<Input
						id="song"
						type="file"
						disabled={isLoading}
						accept=".mp3"
						{...register("song", { required: true })}
					/>
				</div>
				<div>
					<div className="pb-1">Select an image!</div>
					<Input
						id="image"
						type="file"
						disabled={isLoading}
						accept="image/*"
						{...register("image", { required: true })}
					/>
				</div>
				<Button disabled={isLoading} type="submit">
					Create
				</Button>
			</form>
		</Modal>
	);
};

export default UploadModal;
