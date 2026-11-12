import {useGetTrackingloadsQuery} from '@app/redux/query/queryApi';

const useTrackingLoads = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTrackingloadsQuery();

  const loads = data?.data ?? [];

  return {
    loads,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

export default useTrackingLoads;