function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-indigo-500 border-b-indigo-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
