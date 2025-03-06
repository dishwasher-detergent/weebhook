import { Project } from "@/components/project";
import { Logout } from "@/components/logout";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/50 backdrop-blur-xs">
      <div className="mx-auto flex max-w-4xl flex-row items-center justify-between p-4 md:px-8">
        <Project />
        <Logout />
      </div>
    </header>
  );
}
