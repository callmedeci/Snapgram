import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './AppLayout';
import AuthLayout from './_auth/AuthLayout';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import RootLayout from './_root/RootLayout';

import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from './_root/pages';

import AuthProvider from './context/AuthContext';
import './index.css';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              {/* public Routes */}
              <Route element={<AuthLayout />}>
                <Route path='/sign-in' element={<SignInForm />} />
                <Route path='/sign-up' element={<SignUpForm />} />
              </Route>

              {/* Private Routes */}
              <Route element={<RootLayout />}>
                <Route index element={<Home />} />

                <Route path='/explore' element={<Explore />} />
                <Route path='/saved' element={<Saved />} />
                <Route path='/all-users' element={<AllUsers />} />

                <Route path='/create-post' element={<CreatePost />} />
                <Route path='/update-post/:id' element={<EditPost />} />
                <Route path='/posts/:id' element={<PostDetails />} />

                <Route path='/profile/:id/*' element={<Profile />} />
                <Route path='/update-profile/:id' element={<UpdateProfile />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
