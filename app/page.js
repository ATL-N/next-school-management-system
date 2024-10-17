import Maindashboard from "./pages/dashboard/maindashboard";
import SidePanel from "./components/sidepanel/sidepanel";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";


export default function Home() {
  return (
    <div className="flex bg-gray-200 h-svh overflow-hidden text-cyan-700">
      <div className="flex-1 ml-16 mt-16 mb-16  p-6 pb-16 h-full overflow-auto bg-gray-100">
          <Header />
          <SidePanel />
          <Footer />
          <Maindashboard />
      </div>
    </div>
  );
}
