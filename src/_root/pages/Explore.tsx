import { useEffect, useState } from 'react';
import GridPostList from '../../components/shared/GridPostList';
import Loader from '../../components/shared/Loader';
import SearchResults from '../../components/shared/SearchResults';
import { Input } from '../../components/ui/input';
import { useDebounce } from '../../hooks/useDebounce';
import {
  useGetPosts,
  useSearchPosts,
} from '../../lib/react-query/querisAndMutations';

import { useInView } from 'react-intersection-observer';

function Explore() {
  const { ref, inView } = useInView();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { posts, hasNextPage, fetchNextPage } = useGetPosts();
  const { searchedPosts, isSearching } = useSearchPosts(debouncedQuery);

  useEffect(
    function () {
      if (inView && !query) fetchNextPage();
    },
    [inView, query, fetchNextPage]
  );

  if (!posts)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );

  const shouldShowSearchResults = query !== '';
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Seach Posts</h2>

        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img
            src='/assets/icons/search.svg'
            width={24}
            height={24}
            alt='search'
          />

          <Input
            type='text'
            placeholder='Search'
            className='explore-search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Add This Feature Later, for Filter posts */}
      {/* <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>

        <div className='flex-center px-4 py-2 gap-3 rounded-xl cursor-pointer bg-dark-3'>
          <p className='small-medium md:base-medium text-light-2'>All</p>

          <img
            src='/assets/icons/filter.svg'
            width={24}
            height={24}
            alt='filter'
          />
        </div>
      </div> */}

      <div className='flex flex-wrap gap-9 w-full max-w-5xl mt-16'>
        {shouldShowSearchResults ? (
          <SearchResults
            isSearching={isSearching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
        ) : (
          posts.pages.map((item, i) => (
            <GridPostList key={i} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !query && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Explore;
