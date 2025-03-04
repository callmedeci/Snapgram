import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
  isSearching: boolean;
  searchedPosts: Models.Document[];
};

function SearchResults({ isSearching, searchedPosts }: SearchResultsProps) {
  if (isSearching) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (searchedPosts && searchedPosts.documents?.length > 0)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return <GridPostList posts={searchedPosts.documents} />;

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found :(</p>
  );
}

export default SearchResults;
