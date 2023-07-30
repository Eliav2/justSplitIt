import Loading from '@/components/Loading';

interface QueryIndicatorProps {
  children: React.ReactNode;
  loading: boolean;
}

const QueryIndicator = ({ children, loading }: QueryIndicatorProps) => {
  if (loading) return <Loading />;
  return children;
};
export default QueryIndicator;
