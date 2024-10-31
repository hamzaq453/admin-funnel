import LeadDetailPage from '@/app/components/LeadDetailPage';

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <LeadDetailPage id={(await params).id} />;
}
