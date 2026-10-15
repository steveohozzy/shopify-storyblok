import YourCollection from "@/components/YourCollection";
import { getProducts } from "@/lib/shopify";

export default async function YourCollectionPage() {
  const items = await getProducts();

  return <YourCollection items={items} />;
}
