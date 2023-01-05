import { BrowserRouter } from "react-router-dom";
import { AppBridgeProvider, QueryProvider } from "./components";
import HomePage from "./pages/HomePage";
import './css/app.scss';

export default function App() {
  return (
    <BrowserRouter>
      <AppBridgeProvider>
        <QueryProvider>
          <HomePage />
        </QueryProvider>
      </AppBridgeProvider>
    </BrowserRouter>
  );
}
