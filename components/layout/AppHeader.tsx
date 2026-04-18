import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/children", label: "My Children" },
  { href: "/favorites", label: "Favorites" },
];

export function AppHeader() {
  return (
    <header className="app-header">
      <Link className="brand-mark" href="/">
        <span className="brand-mark__spark" aria-hidden="true" />
        <span>
          <strong>Lullaby Lane</strong>
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
