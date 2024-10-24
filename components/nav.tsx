import { Project } from "@/components/project";

export function Nav() {
  return (
    <header className="w-full border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Project />
      </div>
    </header>
  );
}
