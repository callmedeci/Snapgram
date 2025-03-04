import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

function AppLayout() {
  return (
    <main className='flex h-dvh'>
      <Outlet />

      <Toaster />
    </main>
  );
}

export default AppLayout;
