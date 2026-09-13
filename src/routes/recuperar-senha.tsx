import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  component: RecoverPasswordPage,
});

function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      toast.success("Verifique o seu e-mail para redefinir a palavra-passe.");
    } catch (error) {
      toast.error(friendlyError(error instanceof Error ? error.message : "Falha ao enviar pedido."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Mail className="size-5" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Recuperar palavra-passe</CardTitle>
          <CardDescription>Vamos enviar uma ligação para redefinir a sua senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A enviar..." : "Enviar link"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Voltar para o <Link to="/login" className="font-medium text-primary hover:underline">login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
