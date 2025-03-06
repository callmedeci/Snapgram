import Loader from '@/components/shared/Loader';
import { useGetUser } from '@/lib/react-query/querisAndMutations';
import { useParams } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const { user, isLoading } = useGetUser(id || '');

  if (isLoading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <img src={user?.imageUrl} className='w-24 h-24 rounded-full' />
        <div className='flex flex-col justify-center items-center xl:items-start'>
          <h2 className='h3-bold md:h2-bold'>{user?.name}</h2>
          <p className='small-regular text-light-3'>@{user?.username}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
