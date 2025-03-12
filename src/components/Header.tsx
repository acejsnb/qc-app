import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function Header() {

  return (
    <header className="bg-gray-800 flex items-center w-full h-16">
      <div className="flex items-center justify-between container mx-auto">
        <div className="text-white">QCApp</div>
        <div className="">
          <ConnectButton/>
        </div>
      </div>
    </header>
  )
}
