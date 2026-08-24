import "./globals.css";

export const metadata = {
  title: "ATS Resume Builder",
  description: "Create and optimize ATS-friendly resumes in minutes. No sign-up required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
