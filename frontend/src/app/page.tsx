import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/app/(protected)/home/page";

export default function Page() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
