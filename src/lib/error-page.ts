export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Esta página não carregou</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font: 15px/1.5 system-ui, -apple-system, sans-serif;
        background: #0d1414;
        color: #f3f7f6;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 28rem;
        width: 100%;
        text-align: center;
        padding: 2rem;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 1rem;
        background: rgba(17, 24, 24, 0.95);
      }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #bfd0cb; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #7ad7c1; color: #0b1211; }
      .secondary { background: transparent; color: #f3f7f6; border-color: rgba(255,255,255,0.15); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Esta página não carregou</h1>
      <p>Ocorreu um problema no nosso lado. Pode tentar atualizar a página ou voltar ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
