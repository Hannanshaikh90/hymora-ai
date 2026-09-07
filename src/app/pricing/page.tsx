import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";
import { isProUser } from "@/lib/subscription";

export default async function PricingPage() {
  const proUser = await isProUser();

  return (
    <PricingClient proUser={proUser} />
  );
}