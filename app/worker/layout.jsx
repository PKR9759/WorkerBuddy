import WorkerNavbar from "@/components/WorkerNavbar";

export const metadata = {
  title: "Worker Dashboard",
  description: "Worker dashboard layout and navigation",
};

export default function WorkerLayout({ children }) {
  return (
    <>
      <WorkerNavbar />
      <main className="bg-gray-900 min-h-screen pt-16 text-white max-w-7xl mx-auto px-4">
        {children}
      </main>
    </>
  );
}
