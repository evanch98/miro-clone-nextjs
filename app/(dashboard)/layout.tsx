interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * @description Layout structure for Dashboard
 * @param param0 children accepts React.ReactNode elements
 * @returns JSX Elements
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">{children}</div>
    </main>
  );
};

export default DashboardLayout;
