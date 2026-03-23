import { useLandingContent } from '../../../shared/hooks/useLandingContent';

type PolicyPageProps = {
  type: 'privacy' | 'user';
};

export default function PolicyPage({ type }: PolicyPageProps) {
  const { content, isLoading, error } = useLandingContent();

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f9fafb] pt-24">
        <div className="text-gray-500">Yükleniyor...</div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f9fafb] pt-24">
        <div className="text-red-500">İçerik yüklenemedi.</div>
      </main>
    );
  }

  const policyContent = type === 'privacy' ? content.privacyPolicy : content.userPolicy;

  return (
    <main className="min-h-screen bg-[#f9fafb] px-6 py-32 md:px-20 lg:py-40">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12 lg:p-16">
        <div className="mb-8">
          <span className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600">
            {policyContent.label}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            {policyContent.title}
          </h1>
        </div>
        <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
          {policyContent.content}
        </div>
      </div>
    </main>
  );
}
