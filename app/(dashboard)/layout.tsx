interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * @description Layout structure for Dashboard
 * @param param0 children accepts React.ReactNode elements
 * @returns JSX Elements
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <div>{children}</div>;
};

export default DashboardLayout;
