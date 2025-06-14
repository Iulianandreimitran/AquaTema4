interface HeaderProps {
  title: string;

}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm mb-2">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
      >
        Logout
      </button>
    </header>
  );
}
