import Navbar from "@/components/Navbar";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
}
