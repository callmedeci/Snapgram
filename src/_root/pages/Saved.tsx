import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useGetSavedPosts } from '@/lib/react-query/querisAndMutations';

function Saved() {
  const { savedPosts, isLoading } = useGetSavedPosts();
  const posts = savedPosts?.documents.map((item) => ({
    ...item,
    ...item.post,
  }));

  if (isLoading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );

  return (
    <div className='saved-container'>
      <div className='flex items-center self-start gap-2'>
        <img
          src='/assets/icons/save.svg'
          width={36}
          height={36}
          className='mix-blend-luminosity'
        />
        <h2 className='h3-bold md:h2-bold w-full'>Saved Posts</h2>
      </div>
      <GridPostList posts={posts} showStats={false} />
    </div>
  );
}

export default Saved;
