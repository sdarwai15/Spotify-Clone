import { Song } from "@/types";
import getSongs from "./getSongs";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	if (!title) {
		return await getSongs();
	}

	const { data, error } = await supabase
		.from("songs")
		.select("*")
		.ilike("title", `%${title}%`)
		.order("created_at", { ascending: false });

	if (error) {
		console.log(error.message);
	}

	return (data as any) || [];
};

export default getSongsByTitle;
