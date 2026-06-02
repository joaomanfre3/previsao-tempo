# ⛅ Previsão do Tempo

Veja o clima atual e a previsão dos próximos 7 dias de qualquer cidade do mundo. Temperatura, sensação, umidade, vento e chance de chuva — com dados ao vivo e sem cadastro.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Server Actions](https://img.shields.io/badge/Server_Actions-000?logo=nextdotjs&logoColor=white)

## O que faz

- **Busca de cidade** com sugestões enquanto você digita
- **Clima atual**: temperatura, sensação, umidade, vento e condição
- **Previsão de 7 dias** com máxima, mínima, ícone e chance de chuva
- **Visual dia/noite** — o cartão muda conforme o período
- Lembra a **última cidade** consultada
- 100% **responsivo**

## O diferencial técnico

Tanto a busca de cidade quanto a previsão acontecem em **Next.js Server Actions** (`app/actions.ts`): o navegador nunca chama a API externa direto — quem busca é o servidor, que devolve só o necessário. Os códigos de clima da [Open-Meteo](https://open-meteo.com/) (padrão WMO) são traduzidos pra português com ícone correspondente.

A Open-Meteo é **gratuita e sem token**, então o projeto roda na Vercel sem nenhuma variável de ambiente.

## Stack

Next.js 16 (App Router + Server Actions) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide. Sem banco — a última cidade fica no `localStorage`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy

Pronto pra Vercel — importe o repositório, build padrão (`next build`), zero variáveis de ambiente.

---

Feito por [@joaomanfre3](https://github.com/joaomanfre3).
