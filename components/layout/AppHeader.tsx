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
        <Image src="/images/logo-v1.svg" alt="Bedtime logo" width={40} height={40} className="brand-mark__logo" />
        <span className="brand-mark__text">
          <strong>BedTime</strong>
          <small>A Story Studio for your kid</small>
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
