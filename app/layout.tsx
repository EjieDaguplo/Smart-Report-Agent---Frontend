import './globals.css';

export const metadata = {
  title: 'LGU Smart Report Agent – Bohol',
  description: 'AI-powered data analysis and reporting for LGU Philippines',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      <link rel="shortcut icon" href="srlogo.png" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}

