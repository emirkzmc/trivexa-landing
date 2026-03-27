import PasswordResetModule from "../components/PasswordResetModule";
import LoginBackground from "../../../shared/ui/LoginBackground";

const MOCK_CLIENT_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

export default function PasswordResetPreviewPage() {
  return (
    <LoginBackground showGradientOrbs={false} contentClassName="min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <PasswordResetModule
          clientUserId={MOCK_CLIENT_USER_ID}
          onSuccess={() => undefined}
          onBackToLogin={() => window.history.back()}
        />
      </div>
    </LoginBackground>
  );
}
