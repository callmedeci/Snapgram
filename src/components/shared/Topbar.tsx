import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '../../lib/react-query/querisAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '../../context/AuthContext';

function Topbar() {
  const { user } = useUserContext();
  const { signOutAccount, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

  useEffect(
    function () {
      if (isSuccess) navigate('/sign-in');
    },
    [isSuccess, navigate]
  );

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={130}
            height={325}
          />
        </Link>

        <div className='flex gap-4'>
          <Button
            variant='ghost'
            className='shad-button-_ghost'
            onClick={() => signOutAccount()}
          >
            <img src='/assets/icons/logout.svg' alt='logout' />
          </Button>

          <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
            <img
              src={`${
                user.imageUrl || '/assests/icons/profile-placeholder.svg'
              }`}
              alt='profile'
              className='h-8 w-8 rounded-full'
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
