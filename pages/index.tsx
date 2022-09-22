import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-24 rounded-lg bg-white p-8 text-center">
      <h2 className="text-2xl font-bold tracking-wide text-slate-800">
        Welcome to <br /> Tic-Tac-Toe
      </h2>
      <h4 className="text-base font-medium tracking-wide text-slate-600">
        Choose your game
      </h4>
      <div>
        <Link href="/offline">
          <a className="rounded-lg bg-blue-500 p-4 text-white">Offline mode</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
