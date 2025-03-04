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
import { useSignInAccount } from '../../lib/react-query/querisAndMutations';
import { SigninValidationSchema } from '../../lib/validation';

function SignIn() {
  const navigate = useNavigate();
  const { isSigningIn, signInAccount } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isWorking = isSigningIn || isUserLoading;

  async function onSubmit(values: z.infer<typeof SigninValidationSchema>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    console.log(session);

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

        <h2 className='h3-bold md:h2-bold sm:pt-12'>Log in to your account</h2>
        <p className='text-light-3 small-medium md:base-regular'>
          Welcome back, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 mt-4 w-full'
        >
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
              'Sign in'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don't have an account?
            <Link
              to='/sign-up'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignIn;
