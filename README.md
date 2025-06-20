# ChatLX

ChatLX is an AI-powered chat application built with Next.js, featuring intelligent conversations, user authentication, and a modern, responsive interface.

## Features

- 🤖 AI-powered chat conversations using OpenAI
- 🔐 Secure user authentication with NextAuth.js
- 💾 Database integration with Prisma
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📱 Responsive design for all devices
- 🌙 Dark/light theme support

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables (create a `.env.local` file)
4. Run the database migrations:

```bash
npx prisma migrate dev
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

You can start customizing the application by modifying [`app/page.tsx`](app/page.tsx). The page auto-updates as you edit the file.

## Project Structure

- [`app/`](app/) - Next.js app directory containing pages and components
- [`app/components/`](app/components/) - Reusable React components
- [`app/api/`](app/api/) - API routes
- [`prisma/`](prisma/) - Database schema and migrations
- [`public/`](public/) - Static assets

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com)
- **Database**: [Prisma ORM](https://prisma.io)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **AI Integration**: [OpenAI API](https://openai.com/api)
- **Font**: [Geist](https://vercel.com/font) - optimized with [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Prisma Documentation](https://www.prisma.io/docs) - learn about database management with Prisma
- [NextAuth.js Documentation](https://next-auth.js.org) - authentication for Next.js

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
