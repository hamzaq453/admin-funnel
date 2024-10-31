import LeadDetailPage from '@/app/components/LeadDetailPage';

export default async function LeadPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  return <LeadDetailPage id={resolvedParams.id} />;
}
