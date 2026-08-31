# Portfólio — João Pedro Gonzaga de Assis

Site em **HTML5 + CSS3 + JavaScript puro** (sem build, sem instalação de pacotes).
Abra e edite direto — não precisa de Node, npm nem servidor especial.

## Estrutura de arquivos

```
portfolio/
├── index.html         → todo o conteúdo e a estrutura das seções
├── style.css          → todo o visual (cores, tipografia, layout, animações)
├── script.js           → interações: menu, scroll reveal, cursor, contadores
├── assets/img/         → pasta vazia, pronta para receber sua foto
└── README.md
```

**Importante:** os 3 arquivos (`index.html`, `style.css`, `script.js`) precisam ficar
sempre na mesma pasta, um do lado do outro. Se você baixou cada arquivo separado
(um por um), verifique se todos caíram na mesma pasta antes de abrir o `index.html`
— se estiverem espalhados em pastas diferentes, o CSS e o JS não vão carregar.

## Como rodar

**Opção mais simples:** dê duplo-clique em `index.html` e abra no navegador.

**Opção recomendada** (evita qualquer bloqueio de segurança do navegador para
arquivos locais), com Python já instalado na maioria dos PCs:

```bash
cd portfolio
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

Se preferir usar o VS Code, a extensão **Live Server** faz a mesma coisa com um clique.

## O que trocar antes de publicar

| O que | Onde | Como encontrar |
|---|---|---|
| Sua foto | `index.html` | Procure `[FOTO: substitua...]` na seção "Sobre" (`id="sobre"`). Coloque o arquivo em `assets/img/avatar.jpg` e troque o `<div class="avatar-initials">JP</div>` por `<img src="assets/img/avatar.jpg" alt="Foto de João Pedro">` |
| Links dos projetos | `index.html` | Procure por `href="#"` dentro de `id="projetos"` — são os 4 cards (Bot WhatsApp, Power BI, SQL, SaaS). Troque pelos links reais quando publicar cada projeto |
| Link do GitHub | `index.html` | Procure `[LINK DO GITHUB]` na seção de contato (`id="contato"`) |
| Textos do hero/sobre | `index.html` | Está tudo em português, direto no HTML — edite livremente |
| Cores | `style.css`, bloco `:root` no topo | Variáveis `--accent`, `--bg`, etc. |

Seus dados de contato (e-mail, telefone, LinkedIn) já estão preenchidos com o que veio
do seu currículo.

## Sobre o design

- **Nav circular flutuante**: fica fixa no topo, ganha fundo com blur ao rolar a página.
- **Cursor customizado**: só aparece em desktop (mouse), some automaticamente no celular.
- **Terminal/gráfico animado no hero**: efeito de digitação de uma query SQL + barras
  de gráfico que "crescem" ao entrar na tela — ligado ao seu perfil de dados, não é
  decoração genérica.
- **Projetos**: os 4 projetos pessoais do seu currículo, em grid assimétrico (um
  projeto principal maior + três menores).
- Todas as animações respeitam `prefers-reduced-motion` (se a pessoa desativa
  animações no sistema operacional, o site desativa também).

## Publicar online (gratuito)

Qualquer uma destas opções funciona sem precisar de servidor próprio, bastando
arrastar a pasta `portfolio`:

- **Vercel** (vercel.com) — arraste a pasta ou conecte um repositório GitHub
- **Netlify** (netlify.com) — arraste a pasta direto no painel ("Deploy manually")
- **GitHub Pages** — suba os arquivos para um repositório e ative o Pages nas configurações
