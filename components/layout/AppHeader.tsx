import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/library", label: "Library" },
  { href: "/favorites", label: "Favorites" },
];

export function AppHeader() {
  return (
    <header className="app-header">
      <Link className="brand-mark" href="/">
        <Image src="/images/logo.svg" alt="StorySpark logo" width={32} height={32} className="brand-mark__logo" />
        <span>
          <strong>StorySpark</strong>
          <small>Story studio for families</small>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Primary">
        {navigationLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
