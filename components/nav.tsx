import { Project } from "@/components/project";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl p-4 md:px-8">
        <Project />
      </div>
    </header>
  );
}
