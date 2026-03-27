import { useMemo, useState, type FormEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import LoginBackground from "../../../shared/ui/LoginBackground";
import PasswordResetModule from "../components/PasswordResetModule";
import { ApiHttpError, loginCustomerPanel } from "../model/api";
import type { CustomerPanelSession } from "../model/types";

interface CustomerLoginPageProps {
  onLogin: (session: CustomerPanelSession) => void;
}

export default function CustomerLoginPage({ onLogin }: CustomerLoginPageProps) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [email, setEmail] = useState(() => params.get("email")?.trim() || "");
  const [password, setPassword] = useState("");
  const [pendingForceChange, setPendingForceChange] = useState<{
    clientUserId: string;
    email: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMagicToken = Boolean(params.get("token"));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const session = await loginCustomerPanel(email.trim(), password);
      if (session.forcePasswordChange) {
        if (!session.userId) {
          setErrorMessage("�?ifre değişim adımı için kullanıcı bilgisi alınamadı.");
          return;
        }
        setPendingForceChange({
          clientUserId: session.userId,
          email: session.userEmail || email.trim(),
        });
        setPassword("");
        return;
      }
      onLogin(session);
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setErrorMessage("E-posta veya şifre hatalı.");
        return;
      }
      const fallbackMessage = "Giriş yapılamadı. Bilgileri kontrol edip tekrar deneyin.";
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(fallbackMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForceChangeSuccess(newPassword: string) {
    if (!pendingForceChange) return;
    const refreshedSession = await loginCustomerPanel(pendingForceChange.email, newPassword);
    if (refreshedSession.forcePasswordChange) {
      throw new Error("�?ifre değişimi tamamlanamadı. Lütfen tekrar deneyin.");
    }
    setPendingForceChange(null);
    onLogin(refreshedSession);
  }

  return (
    <LoginBackground showGradientOrbs={false} contentClassName="h-screen">
      <div className="relative h-screen">
        <div
          className={`grid h-screen grid-cols-1 transition md:grid-cols-2 ${
            pendingForceChange ? "pointer-events-none select-none blur-[2px]" : ""
          }`}
        >
          <div className="hidden h-full md:block">
            <p className="absolute mt-15 w-147 translate-x-1/4 translate-y-1/2 text-5xl font-semibold text-white">
              Geleceğinizi inşa edelim
            </p>
            <p className="absolute bottom-0 mb-4 ml-4 text-4xl font-extralight text-white">TRIVEXA</p>
            <img src="/Img.png" alt="Login görseli" className="pointer-events-none h-screen w-full object-cover" />
          </div>

          <div className="flex h-full items-center justify-center px-6 py-10 md:px-12">
            <section className="flex w-full max-w-md flex-col gap-12 p-6 text-center">
              <h1 className="text-5xl leading-17 text-[#111827]">Merhaba, seni görmek güzel.</h1>

              {hasMagicToken && (
                <p className="mt-6 rounded-md border border-[#d1d5db] bg-[#f8fafc] px-4 py-3 text-left text-xs text-[#374151]">
                  Portal erişim bağlantısı algılandı. Devam etmek için e-posta ve şifrenizle giriş yapın.
                </p>
              )}

              <form className="mt-6 space-y-8 px-10" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-8">
                  <Input
                    variant="login"
                    id="username"
                    name="username"
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />

                  <Input
                    variant="login"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-left text-xs text-[#b91c1c]">
                    {errorMessage}
                  </p>
                )}

                <Button type="submit" variant="login" disabled={isSubmitting}>
                  {isSubmitting ? "GİRİŞ YAPILIYOR..." : "GİRİŞ"}
                </Button>
              </form>
            </section>
          </div>
        </div>

        {pendingForceChange && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 px-4 py-8 backdrop-blur-sm"
            onClick={() => setPendingForceChange(null)}
          >
            <div className="w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
              <p className="mb-6 rounded-md border border-[#fde68a] bg-[#fffbeb] px-3 py-2 text-left text-xs text-[#92400e]">
                İlk girişte şifrenizi değiştirmeniz zorunludur.
              </p>
              <PasswordResetModule
                clientUserId={pendingForceChange.clientUserId}
                onSuccess={handleForceChangeSuccess}
                onBackToLogin={() => setPendingForceChange(null)}
              />
            </div>
          </div>
        )}
      </div>
    </LoginBackground>
  );
}
