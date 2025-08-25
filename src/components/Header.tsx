import { Link } from "@tanstack/react-router";
import AuthMenu from "@/components/AuthMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur dark:bg-black/40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold">Naveeg</Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/features" className="opacity-80 hover:opacity-100">Features</Link>
            <Link to="/pricing" className="opacity-80 hover:opacity-100">Pricing</Link>
            <Link to="/workspace" className="opacity-80 hover:opacity-100">Workspace</Link>
          </nav>
        </div>
        <AuthMenu />
      </div>
    </header>
  );
}