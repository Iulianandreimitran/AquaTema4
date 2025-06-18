import Header from "../components/Header";

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Access Denied" />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <h1 className="text-3xl font-bold text-red-600 text-center px-6">
          ⛔ Nu ai permisiunea să accesezi această pagină.
        </h1>
      </div>
    </div>
  );
}
