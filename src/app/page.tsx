import Header from '@/components/Header';
import Account from './components/Account'

export default function Home() {

  return (
    <div className="w-full font-[family-name:var(--font-geist-sans)]">
      <main>
        <Header />
        <div className="container mx-auto">
          <h1>Home</h1>
          <Account />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
