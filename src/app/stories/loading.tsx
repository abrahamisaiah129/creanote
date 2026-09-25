import { PageLoader } from '@/components/PageLoader';

export default function StoriesLoading() {
  return <PageLoader message="Loading creator stories & visual archives..." isOverlay={false} />;
}
