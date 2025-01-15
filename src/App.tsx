import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Routes } from "@/routes";
import { Layout } from "@/components/Layout";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes />
          <Toaster />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;