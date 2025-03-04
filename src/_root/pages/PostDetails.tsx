import { formatDistance, subDays } from 'date-fns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import { Button } from '../../components/ui/button';
import { useUserContext } from '../../context/AuthContext';
import {
  useDeletePost,
  useGetPostById,
} from '../../lib/react-query/querisAndMutations';
import PostStats from '../../components/shared/PostStats';
import { toast } from 'sonner';

function PostDetails() {
  const { id } = useParams();
  const { post, isLoading } = useGetPostById(id || '');
  const { deletePost, isDeleting } = useDeletePost();

  const { user } = useUserContext();
  const navigate = useNavigate();

  async function handleDeletePost() {
    try {
      await deletePost({ postId: post?.$id || '', imageId: post?.imageId });

      toast('Successfully deleted');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast('Failed to delete, try again');
    }
  }

  return (
    <div className='post_details-container'>
      {isLoading || isDeleting ? (
        <Loader />
      ) : (
        <div className='post_details-card'>
          <img src={post?.imageUrl} alt='post' className='post_details-img' />

          <div className='post_details-info'>
            <div className='flex justify-between w-full'>
              <Link
                to={`/profile/${post?.creator.$id}`}
                className='flex items-center gap-3'
              >
                <img
                  src={
                    post?.creator?.imageUrl || 'assets/profile-placeholder.svg'
                  }
                  alt='creator'
                  className='rounded-full w-8 h-8 lg:w-12 lg:h-12'
                />

                <div className='flex flex-col'>
                  <p className='base-medium lg:body-bold text-light-1'>
                    {post?.creator.name}
                  </p>
                  <div className='flex-center gap-2 text-light-3'>
                    <p className='sutle-semibold lg:small-regular'>
                      {formatDistance(
                        subDays(post?.$createdAt || new Date(), 0),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                    -
                    <p className='sutle-semibold lg:small-regular'>
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className='flex-center gap-1'>
                {user.id === post?.creator.$id && (
                  <>
                    <Link to={`/update-post/${post?.$id}`}>
                      <img
                        src='/assets/icons/edit.svg'
                        alt='edit'
                        width={24}
                        height={24}
                      />
                    </Link>

                    <Button
                      onClick={handleDeletePost}
                      variant='ghost'
                      className='ghost_details-delete-btn'
                    >
                      <img
                        src='/assets/icons/delete.svg'
                        alt='delete'
                        width={24}
                        height={24}
                      />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
              <p>{post?.caption}</p>
              <ul className='flex gap-1 mt-2'>
                {post?.tags.map((tag: string) => (
                  <li key={tag} className='text-light-3'>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className='w-full'>
              <PostStats post={post} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetails;
