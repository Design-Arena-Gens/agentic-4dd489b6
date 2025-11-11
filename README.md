# Autobiography Data Builder

Autobiography Data Builder is a guided storytelling workspace that helps anyone record their life experiences, organize them into meaningful sections, and generate a beautifully written autobiography draft with AI.

## ✨ Highlights

- Secure Firebase authentication (email/password + Google Sign-In)
- Structured, step-by-step data collection covering every chapter of life
- Visual timeline builder for milestones with images and notes
- Gemini-powered story generator with multiple writing styles
- Live editor to refine the generated draft
- Customization for title, cover art, fonts, and inspirational quotes
- Export to PDF, DOCX, or shareable web link
- Optional admin dashboard to review all user autobiographies

## 🧱 Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS, Heroicons
- **Auth & Data:** Firebase Authentication & Firestore
- **AI:** Google Gemini (`@google/generative-ai`)
- **Exports:** jsPDF, docx, file-saver

## 🔐 Environment

Create an `.env.local` by copying `.env.local.example` and filling in your Firebase + Gemini credentials.

```bash
cp .env.local.example .env.local
```

Ensure the Firestore security rules allow authenticated reads/writes for users and public read access to `sharedStories` (or gate it to your needs).

## 🚀 Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to work on your autobiography. Admin dashboards live at `/admin` and shared stories at `/share/:id`.

## 📦 Production

```bash
npm run build
npm start
```

Deploy effortlessly to Vercel using the supplied instructions and environment variables.

## 📝 License

MIT — feel free to adapt and extend the platform for your storytelling needs.
