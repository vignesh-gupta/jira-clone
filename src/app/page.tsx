import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="muted">Link</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tertiary">Outline</Button>
    </div>
  );
}
