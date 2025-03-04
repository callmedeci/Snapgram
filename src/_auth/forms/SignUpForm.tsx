import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Loader from '../../components/shared/Loader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { useUserContext } from '../../context/AuthContext';
import {
  useCreateUserAccount,
  useSignInAccount,
} from '../../lib/react-query/querisAndMutations';
import { SignupValidationSchema } from '../../lib/validation';

function SignUpForm() {
  const navigate = useNavigate();
  const { createUserAccount, isCreatingAccount } = useCreateUserAccount();
  const { isSigningIn, signInAccount } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const isWorking = isSigningIn || isUserLoading || isCreatingAccount;

  async function onSubmit(values: z.infer<typeof SignupValidationSchema>) {
    const newUser = await createUserAccount(values);

    if (!newUser) return toast('Sign up failed. Please try again.');

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) return toast('Sign in failed. Please try again.');

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      toast('Sign up faild, Plase try again.');
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold sm:pt-12'>Create new account</h2>
        <p className='text-light-3 small-medium md:base-regular'>
          To use Reactgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 mt-4 w-full'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='shad-button_primary'>
            {isWorking ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have an account?
            <Link
              to='/sign-in'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignUpForm;
