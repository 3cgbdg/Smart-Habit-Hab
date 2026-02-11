import AuthClientUpload from "@/components/layout/AuthClientUpload";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("MainLayout rendering...");
  return (
    <div className="flex flex-col h-screen relative _container">
      <AuthClientUpload />
      <Header />
      <div className="flex items-start grow border-t  border-neutral-300">
        <div className="  sm:py-6 py-2 px-3 md:p-8 w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
