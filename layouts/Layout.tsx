import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const router = useRouter();
  return (
    <main className="fixed inset-0 bg-slate-200">
      {router.pathname !== '/' && (
        <button onClick={() => router.back()}>Go back</button>
      )}
      <section className="flex h-full w-full items-center justify-center overflow-auto px-4">
        {children}
      </section>
    </main>
  );
};

export default Layout;
