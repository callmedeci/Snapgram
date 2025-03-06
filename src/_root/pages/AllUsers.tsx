import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useGetAllusers } from '@/lib/react-query/querisAndMutations';
import { Link } from 'react-router-dom';

function AllUsers() {
  const { users, isLoading } = useGetAllusers();

  if (isLoading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );

  return (
    <div className='user-container'>
      <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>
      <div className='user-grid'>
        {users?.documents.map((user) => (
          <div
            className='flex flex-col items-center justify-center bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 gap-3'
            key={user.$id}
          >
            <Link
              to={`/profile/${user.$id}`}
              className='flex items-center flex-col gap-1'
            >
              <img src={user.imageUrl} className='w-14 h-14 rounded-full' />
              <p className='base-medium md:body-bold'>{user.name}</p>
              <p className='small-regular text-light-3'>@{user.username}</p>
            </Link>
            <Button className='shad-button_primary whitespace-nowrap capitalize'>
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
