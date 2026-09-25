import { PageLoader } from '@/components/PageLoader';

export default function StoryDetailLoading() {
  return <PageLoader message="Loading story article & reader notes..." isOverlay={false} />;
}
