import { useState, type FormEvent } from "react";
import { forceChangeCustomerPassword } from "../model/api";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";

interface PasswordResetModuleProps {
  clientUserId: string;
  onSuccess: (newPassword: string) => void | Promise<void>;
  onBackToLogin: () => void;
}

export default function PasswordResetModule({
  clientUserId,
  onSuccess,
  onBackToLogin,
}: PasswordResetModuleProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!clientUserId) {
      setErrorMessage("Client ID bulunamadi. Tekrar giris yapin.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Yeni sifre en az 8 karakter olmalidir.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Sifreler ayni degil.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forceChangeCustomerPassword(clientUserId, newPassword);
      await onSuccess(newPassword);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Sifre guncellenemedi. Lutfen tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className=" flex flex-col gap-4 w-full max-w-md  rounded-xl border border-[#d1d5db] bg-white/70  p-8 shadow-sm py-20 ">
      <div  >
      <h2 className="text-xl font-semibold text-[#111827]">Sifre Yenileme</h2>
      <p className="mt-2 text-sm text-[#4b5563]">Devam etmek icin yeni sifrenizi belirleyin.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <label htmlFor="new-password" className="sr-only">
          Yeni sifre
        </label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="w-full text-[15px] focus:border-[#111827]"
          placeholder="Yeni sifre"
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirm-password" className="sr-only">
          Yeni sifre tekrar
        </label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full text-[15px] focus:border-[#111827]"
          placeholder="Yeni sifre tekrar"
          autoComplete="new-password"
          required
        />

        {errorMessage && (
          <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          variant="login"
          disabled={isSubmitting}
          className="mt-0"
        >
          {isSubmitting ? "ISLENIYOR..." : "SIFREYI GUNCELLE"}
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={onBackToLogin}
          className="w-full bg-transparent px-0 py-0 text-sm text-[#4b5563] underline underline-offset-2"
        >
          Vazgec
        </Button>
      </form>
    </section>
  );
}
