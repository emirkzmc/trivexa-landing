import { useMemo, useState, type FormEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import LoginBackground from "../../../shared/ui/LoginBackground";
import { loginCustomerPanel } from "../model/api";
import type { CustomerPanelSession } from "../model/types";

interface CustomerLoginPageProps {
    onLogin: (session: CustomerPanelSession) => void;
}

export default function CustomerLoginPage({ onLogin }: CustomerLoginPageProps) {
    const params = useMemo(() => new URLSearchParams(window.location.search), []);
    const [email, setEmail] = useState(() => params.get("email")?.trim() || "");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasMagicToken = Boolean(params.get("token"));

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const session = await loginCustomerPanel(email.trim(), password);
            onLogin(session);
        } catch (error) {
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

    return (
        <LoginBackground showGradientOrbs={false} contentClassName="h-screen">
            <div className="grid h-screen grid-cols-1 md:grid-cols-2">
                <div className="hidden h-full md:block">
                    <p className="absolute mt-15 w-147 translate-x-1/4 translate-y-1/2 text-5xl font-semibold text-white">Geleceğinizi inşa edelim</p>
                    <p className="absolute bottom-0 mb-4 ml-4 text-4xl font-extralight text-white">TRIVEXA</p>
                    <img src="/Img.png" alt="Login gorseli" className="pointer-events-none h-screen w-full object-cover" />
                </div>

                <div className="flex h-full items-center justify-center px-6 py-10 md:px-12">
                    <section className="w-full max-w-md p-6 text-center">
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
                                    placeholder="E-posta adresi"
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
                                    placeholder="Sifre"
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
                                {isSubmitting ? "GIRIS YAPILIYOR..." : "GIRIS"}
                            </Button>
                        </form>
                    </section>
                </div>
            </div>
        </LoginBackground>
    );
}
