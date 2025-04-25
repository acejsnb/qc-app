'use client';
import Link from 'next/link';
import {usePathname} from "next/navigation";
import clsx from "clsx";

const navs = [
  {name: 'Trade', path: '/trade'},
  {name: 'Commodity', path: '/commodity'},
  {name: 'Receive', path: '/receive'},
];

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-3">
      {navs.map(nav => (
        <Link
          key={nav.path}
          className={clsx(
            'hover:opacity-80 transition duration-200',
            pathname === nav.path && 'text-cyan-400 ',
          )}
          href={nav.path}
        >
          {nav.name}
        </Link>
      ))}
    </nav>
  )
}
