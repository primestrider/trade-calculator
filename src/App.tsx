import { useEffect } from "react";
import { BalanceInput } from "./components/BalanceInput";
import { SelectTicker } from "./components/SelectTicker";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Toaster } from "./components/ui/sonner";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <main className="min-h-screen font-manrope p-3 md:p-5">
      <Card className="mx-auto max-w-3xl ">
        <CardHeader>
          <CardTitle>
            <h1 className="text-neutral-50 font-bold text-xl text-center">
              Trade Calculator Setup
            </h1>
          </CardTitle>
        </CardHeader>
        <div className="px-3">
          <Separator />
        </div>
        <CardContent className="space-y-6">
          <BalanceInput />
          <SelectTicker />
        </CardContent>
      </Card>
      <Toaster></Toaster>
    </main>
  );
}

export default App;
