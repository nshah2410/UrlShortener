import { AppProvider } from "./store/AppStore";
import { useApp } from "./store/appContext";
import Dashboard from "./components/Dashboard";
import AuthScreen from "./screens/AuthScreen";

function Root() {
  const { authed } = useApp();
  return (
    <div className="h-full w-full overflow-hidden bg-appbg text-ink">
      {authed ? <Dashboard /> : <AuthScreen />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

export default App;
