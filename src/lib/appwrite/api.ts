import { ID, Query } from 'appwrite';
import { INewPost, INewUser, IUpdatePost } from '../../types';
import { account, appwriteConfig, avatars, databases, storage } from './config';

//Save new account to Database
export async function saveUserToDB(user: {
  accountId: string;
  username: string;
  email: string;
  name: string;
  imageUrl: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

//Auth operations
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error('Failed to create user');

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      username: user.username,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    console.log(error);
  }
}

//Get current user
export async function getCurrentUser() {
  try {
    const curAccount = await account.get();
    if (!curAccount) throw new Error('Failed to get account');

    const curUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', curAccount.$id)]
    );

    if (!curUser) throw new Error('Faield to get user');

    return curUser.documents.at(0);
  } catch (error) {
    console.log(error);
    return error;
  }
}

//Create a new POST operations
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw new Error('Failed to upload your file');

    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw new Error('Failed to fetch your image');
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        tags,
        location: post.location,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Failed to create new post');
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  const fileUrl = storage.getFilePreview(
    appwriteConfig.storageId,
    fileId,
    2000,
    2000,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    'top',
    100
  );

  return fileUrl;
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: '200' };
  } catch (error) {
    console.log(error);
  }
}

//Recieve Recent Posts up to 20 posts
export async function getRcentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderAsc('$createdAt'), Query.limit(20)]
  );

  if (!posts) throw new Error('Faield to load posts');

  return posts;
}

// EDIT & DELETE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw new Error('Failed to update the post');

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw new Error('Failed to update the post');

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw new Error('Failed to update the post');

    return { status: 200 };
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error('Failed to upload your file');

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw new Error('Failed to fetch your image');
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        tags,
        caption: post.caption,
        location: post.location,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw new Error('Failed to edit post');
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw new Error('Missing post id or image id');

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    await storage.deleteFile(appwriteConfig.storageId, imageId);

    return { status: 200 };
  } catch (error) {
    console.log(error);
  }
}

//Fetch post by ID
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw new Error('Failed to fetch post data');

    return post;
  } catch (error) {
    console.log(error);
  }
}

//Infinite Posts for explore page
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//Search Posts
export async function searchPosts(searchPost: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchPost)]
    );

    if (!posts) throw new Error('Failed to fetch posts');

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//Saved posts
export async function getSavedPosts() {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId
    );

    if (!savedPosts) throw new Error('Failed to fetch posts');

    return savedPosts;
  } catch (error) {
    console.log(error);
    return error;
  }
}
