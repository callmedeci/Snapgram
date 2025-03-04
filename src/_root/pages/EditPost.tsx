import { useParams } from 'react-router-dom';
import PostForm from '../../components/forms/PostForm';
import Loader from '../../components/shared/Loader';
import { useGetPostById } from '../../lib/react-query/querisAndMutations';

function EditPost() {
  const { id } = useParams();

  const { post, isLoading } = useGetPostById(id || '');

  if (isLoading) return <Loader />;

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <img
            src='/assets/icons/add-post.svg'
            width={36}
            height={36}
            alt='add'
          />

          <h2 className='h3-bold md:h2-bold'>Edit Post</h2>
        </div>

        <PostForm action='update' post={post} />
      </div>
    </div>
  );
}

export default EditPost;
