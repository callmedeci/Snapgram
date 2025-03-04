import { Models } from 'appwrite';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/AuthContext';
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from '../../lib/react-query/querisAndMutations';
import { checkIsLiked } from '../../lib/utils';
import Loader from './Loader';

type PostStatsProps = {
  post?: Models.Document;
};

function PostStats({ post }: PostStatsProps) {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const {
    user: { id },
  } = useUserContext();

  const { likePost } = useLikePost();
  const { savePost, isSavingPost } = useSavePost();
  const { deleteSavedPost, isDeletingSaved } = useDeleteSavedPost();

  const { currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(
    function () {
      setIsSaved(!!savedPostRecord);
    },
    [currentUser, savedPostRecord]
  );

  function handleLikePost(e: React.MouseEvent) {
    e.stopPropagation();

    let newLikes = [...likes];
    const hasLiked = newLikes.includes(id);

    if (hasLiked) newLikes = newLikes.filter((likeId) => likeId !== id);
    else newLikes.push(id);

    setLikes(newLikes);
    likePost({ postId: post?.$id || '', likesArray: newLikes });
  }

  function handleSavePost(e: React.MouseEvent) {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id || '', userId: id });
      setIsSaved(true);
    }
  }

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img
          src={
            checkIsLiked(likes, id)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }
          alt='like'
          width={20}
          height={20}
          className='cursor-pointer'
          onClick={handleLikePost}
        />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>

      <div className='flex gap-2'>
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
            alt='save'
            width={20}
            height={20}
            className='cursor-pointer'
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
}

export default PostStats;
