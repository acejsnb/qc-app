import Link from "next/link";
import Nav from './Nav'
import ConnectWallet from './ConnectWallet'

export default function Header() {

  return (
    <header id="qc-header" className="bg-gray-800 flex items-center w-full h-[64px]">
      <div className="flex items-center justify-between container mx-auto">
        <div className="flex items-center gap-5">
          <Link href="/" className="text-white">QCApp</Link>
          <Nav />
        </div>
        <ConnectWallet />
      </div>
    </header>
  )
}
