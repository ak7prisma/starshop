import Sidebar from "./component/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#0B1120] text-white overflow-hidden font-sans">
      
      <div className="flex-shrink-0 h-full z-20 shadow-xl shadow-blue-900/5">
        <Sidebar />
      </div>

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#0B1120] relative">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full">
           {children}
        </div>
      </main>

    </div>
  );
}