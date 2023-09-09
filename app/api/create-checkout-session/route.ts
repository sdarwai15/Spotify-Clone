import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST(req: Request) {
	const { price, quantity = 1, metadata = {} } = await req.json();

	try {
		const supabase = createRouteHandlerClient({
			cookies,
		});

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const customer = await createOrRetrieveCustomer({
			uuid: user?.id || "",
			email: user?.email || "",
		});

		const session = await stripe.checkout.sessions.create({
			customer,
			payment_method_types: ["card"],
			billing_address_collection: "required",
			line_items: [
				{
					price: price.id,
					quantity,
				},
			],
			mode: "subscription",
			allow_promotion_codes: true,
			subscription_data: {
				// @ts-ignore
				trial_from_plan: true,
				metadata,
			},
			success_url: `${getUrl()}/account`,
			cancel_url: `${getUrl()}`,
			metadata,
		});

		return NextResponse.json({ sessionId: session.id });
	} catch (error: any) {
		console.log(error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
