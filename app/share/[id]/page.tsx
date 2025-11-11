import { ShareClient } from "@/components/ShareClient";

export default function SharePage({ params }: { params: { id: string } }) {
  return <ShareClient shareId={params.id} />;
}
