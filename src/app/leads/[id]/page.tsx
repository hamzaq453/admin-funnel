import LeadDetailPage from '@/app/components/LeadDetailPage';

export default function LeadPage({ params }: { params: { id: string } }) {
  return <LeadDetailPage id={params.id} />;
}
