import { Logo } from "./Logo";

export const AuthHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="flex items-center gap-4 sm:gap-6"></nav>
      </div>
    </header>
  );
};
