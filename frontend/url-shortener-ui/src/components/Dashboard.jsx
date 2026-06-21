import { useApp } from "../store/appContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CreateScreen from "../screens/CreateScreen";
import LinksScreen from "../screens/LinksScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import QrScreen from "../screens/QrScreen";
import DomainsScreen from "../screens/DomainsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const SCREENS = {
  create: CreateScreen,
  links: LinksScreen,
  analytics: AnalyticsScreen,
  qr: QrScreen,
  domains: DomainsScreen,
  settings: SettingsScreen,
};

export default function Dashboard() {
  const { screen } = useApp();
  const Screen = SCREENS[screen] || CreateScreen;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Screen />
        </div>
      </main>
    </div>
  );
}
