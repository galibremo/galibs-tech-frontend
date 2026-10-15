import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

export interface NewsletterSubscribeResponse {
  email: string;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  /** False when the address was already subscribed. */
  isNew: boolean;
}

export async function subscribeToNewsletter(
  email: string,
  source = "home_footer",
): Promise<NewsletterSubscribeResponse> {
  return fetchClient<NewsletterSubscribeResponse>({
    method: "POST",
    url: apiRoute.newsletterSubscribe,
    body: { email: email.trim(), source },
  });
}
