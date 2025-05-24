import WorkerNavbar from "@/components/WorkerNavbar";

export const metadata = {
  title: "Worker Dashboard",
  description: "Worker dashboard layout and navigation",
};

export default function WorkerLayout({ children }) {
  return (
    <>
      <WorkerNavbar />
      <main className="bg-gray-900  pt-10 text-white ">
        {children}
      </main>
    </>
  );
}
