import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { INewPost, INewUser, IUpdatePost } from '../../types';
import {
  getRcentPosts,
  createPost as createPostApi,
  createUserAccount as createUserAccountApi,
  likePost as likePostApi,
  signInAccount as signInAccountApi,
  signOutAccount as signOutAccountApi,
  deleteSavedPost as deleteSavedPostApi,
  savePost as savePostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  getCurrentUser,
  getPostById,
  getInfinitePosts,
  searchPosts,
} from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

export function useCreateUserAccount() {
  const { isPending: isCreatingAccount, mutateAsync: createUserAccount } =
    useMutation({
      mutationFn: (user: INewUser) => createUserAccountApi(user),
    });

  return { isCreatingAccount, createUserAccount };
}

export function useSignInAccount() {
  const { isPending: isSigningIn, mutateAsync: signInAccount } = useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccountApi(user),
  });

  return { isSigningIn, signInAccount };
}

export function useSignOutAccount() {
  const { mutateAsync: signOutAccount, isSuccess } = useMutation({
    mutationFn: signOutAccountApi,
  });

  return { isSuccess, signOutAccount };
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutateAsync: createPost } = useMutation({
    mutationFn: (post: INewPost) => createPostApi(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });

  return { isCreating, createPost };
}

export function useGetRecentPosts() {
  const {
    data: posts,
    isLoading: isPostLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRcentPosts,
  });

  return { posts, isPostLoading, isError };
}

//POST OPERATIONS
export function useLikePost() {
  const queryClient = useQueryClient();

  const { mutate: likePost } = useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePostApi(postId, likesArray),

    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post?.$id],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });

  return { likePost };
}

export function useSavePost() {
  const queryClient = useQueryClient();

  const { mutate: savePost, isPending: isSavingPost } = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePostApi(postId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });

  return { savePost, isSavingPost };
}

export function useDeleteSavedPost() {
  const queryClient = useQueryClient();

  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPostApi(savedRecordId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });

  return { deleteSavedPost, isDeletingSaved };
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  const { mutateAsync: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: (post: IUpdatePost) => updatePostApi(post),

    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post?.$id],
      });
    },
  });

  return { updatePost, isUpdating };
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutateAsync: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePostApi(postId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });

  return { deletePost, isDeleting };
}

///////////

//GET CURRENT USER
export function useGetCurrentUser() {
  const { data: currentUser } = useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });

  return { currentUser };
}

//Receive Selected POST
export function useGetPostById(postId: string) {
  const { data: post, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),

    enabled: !!postId,
  });

  return { post, isLoading };
}

//Infinite Posts
export function useGetPosts() {
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage?.documents.length === 0) return null;

      const lastPageId =
        lastPage?.documents[lastPage?.documents.length - 1].$id;

      return lastPageId;
    },
  });

  return { posts, isLoading, fetchNextPage, hasNextPage };
}

export function useSearchPosts(query: string) {
  const { data: searchedPosts, isLoading: isSearching } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, query],
    queryFn: () => searchPosts(query),

    enabled: !!query,
  });

  return { searchedPosts, isSearching };
}
