import { ImageGround } from "@/components/ImageGround";
import { getRandomSuggestions } from "@/lib/suggestions";

export const dynamic = "force-dynamic";

export default function Home() {
  return <ImageGround suggestions={getRandomSuggestions()} />;
}
