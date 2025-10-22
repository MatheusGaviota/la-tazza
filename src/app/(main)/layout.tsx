import Navbar from "@/components/Navbar";
import AccessibilityTray from "@/components/AccessibilityTray";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="pt-[92px]">
        <Navbar />
        <AccessibilityTray />
        {children}
      </div>
    </>
  );
}
