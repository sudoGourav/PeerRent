import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </>
  );
}