import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className='flex flex-col flex-1 justify-center items-center py-10'>
            <Outlet />
          </section>

          <img
            src='/assets/images/side-img.svg'
            alt='logo'
            className='hidden xl:block bg-no-repeat h-dvh w-1/2 object-cover'
          />
        </>
      )}
    </>
  );
}

export default AuthLayout;
