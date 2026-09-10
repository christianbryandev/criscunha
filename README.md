# Cris Cunha — Drenagem Linfática & Pós-Operatório

Site institucional de página única para Cris Cunha, especialista em drenagem linfática
pós-operatória no Centro de Ribeirão Preto - SP.

Site estático: HTML, CSS e JavaScript sem frameworks nem dependências em produção.

## Estrutura

```
index.html                  página completa
assets/css/style.css        estilos e breakpoints
assets/js/main.js           menu, reveal no scroll, trilha lateral, vídeo
assets/media/               imagens e vídeo já otimizados para a web
midias/                     arquivos originais (fonte, fora do controle de versão)
```

## Rodar localmente

```bash
npx serve -l 4321 .
```

Abra `http://localhost:4321`.

## Publicar

Qualquer hospedagem estática serve (Netlify, Vercel, GitHub Pages, Hostinger).
Basta enviar a raiz do projeto — não há build.

Depois de definir o domínio, acrescente no `<head>` do `index.html`:

```html
<link rel="canonical" href="https://SEU-DOMINIO/">
<meta property="og:url" content="https://SEU-DOMINIO/">
```

e troque `og:image` e o campo `image` do JSON-LD pela URL absoluta da imagem.

## Mídia

Os arquivos de `assets/media/` são derivados dos originais em `midias/`:

- **Retrato** — `HERO PROFISSIONAL.png` em WebP/JPG, recorte quadrado (desktop)
  e vertical 4:5 ancorado no topo (mobile), para o rosto nunca ser cortado.
- **Vídeo** — trecho de 22,4 s (16,0 s → 38,4 s) de `video profissional.mp4`,
  sem áudio, em 720×1280 (2,3 MB) e 480×854 (1,0 MB) para telas menores.
  Carrega apenas quando a seção se aproxima da viewport.
- **Galeria e seção Sobre** — quadros extraídos do vídeo original.
- **Depoimentos** — recortes diretos de `avaliacoes.png`, o print real do Google.
  As avaliações não são recriadas em HTML.

Para regerar a mídia é preciso `ffmpeg` e `sharp`; os comandos usados estão
documentados no histórico de commits.

## Conteúdo

Todo texto, número e avaliação vem de informação verificada do atendimento.
Não há preço, duração, protocolo, formação ou promessa de resultado no site,
e a seção do pós-operatório traz um aviso de que o atendimento não substitui
acompanhamento médico.
