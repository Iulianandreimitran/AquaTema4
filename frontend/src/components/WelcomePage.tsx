
export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Welcome!</h1>
        <p className="text-gray-700 text-lg">
          Thank you for visiting our platform. <br />
          Please sign in or create an account to continue.
        </p>
      </div>
    </div>
  );
}
