import { Outlet, useNavigate } from 'react-router-dom';
import Bottombar from '../components/shared/Bottombar';
import LeftSidebar from '../components/shared/LeftSidebar';
import Topbar from '../components/shared/Topbar';
import { useUserContext } from '../context/AuthContext';

function RootLayout() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  if (!user.id || !user) navigate('/sign-in');
  else
    return (
      <div className='w-full md:flex'>
        <Topbar />

        <LeftSidebar />

        <section className='w-full flex-1 min-h-dvh'>
          <Outlet />
        </section>

        <Bottombar />
      </div>
    );
}

export default RootLayout;
