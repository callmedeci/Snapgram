import { zodResolver } from '@hookform/resolvers/zod';
import { Models } from 'appwrite';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { useUserContext } from '../../context/AuthContext';
import {
  useCreatePost,
  useUpdatePost,
} from '../../lib/react-query/querisAndMutations';
import { PostValidationSchema } from '../../lib/validation';
import FileUploader from '../shared/FileUploader';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type PostFormProps = {
  post?: Models.Document;
  action: 'create' | 'update';
};

function PostForm({ post, action }: PostFormProps) {
  const { user } = useUserContext();

  const { createPost, isCreating } = useCreatePost();
  const { updatePost, isUpdating } = useUpdatePost();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidationSchema>>({
    resolver: zodResolver(PostValidationSchema),
    defaultValues: {
      caption: post ? post?.caption : '',
      location: post ? post?.location : '',
      tags: post ? post?.tags.join(',') : '',
      file: [],
    },
  });

  const isWorking = isUpdating || isCreating;

  async function onSubmit(values: z.infer<typeof PostValidationSchema>) {
    if (post && action === 'update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post?.$id,
        imageUrl: post?.imageUrl,
        imageId: post?.imageId,
      });

      if (!updatedPost) return toast('Failed to update the post');

      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) return toast('Please try again');

    navigate('/');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-9 w-full max-w-5xl'
      >
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>

              <FormControl>
                <Textarea
                  className='shad-textarea custom-scrollbar'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>

              <FormControl>
                <FileUploader
                  filedChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>

              <FormControl>
                <Input type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>
                Add Tags (seprated by comma " , ")
              </FormLabel>

              <FormControl>
                <Input
                  type='text'
                  className='shad-input'
                  placeholder='Learn, Art, Expression'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-4 justify-end'>
          <Button type='button' className='shad-button_dark_4'>
            Cancel
          </Button>

          <Button
            disabled={isWorking}
            type='submit'
            className='shad-button_primary whitespace-nowrap capitalize'
          >
            {isWorking && 'Loading...'}
            {!isWorking && `${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
