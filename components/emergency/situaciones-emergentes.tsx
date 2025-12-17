export function SituacionesEmergentes() {
  return (
    <div className="group mb-6 cursor-pointer">
      <div className="
        bg-gradient-to-r from-blue-50 to-indigo-50
        border border-blue-200
        rounded-xl
        p-6
        hover:shadow-sm
        transition-shadow
      ">
        <div className="flex items-center justify-between text-gray-700">
          <span className="text-lg font-semibold">
            Situaciones emergentes
          </span>

          <span className="
            text-indigo-600
            font-bold
            text-2xl
            transition-transform
            duration-300
            group-hover:translate-x-1
          ">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
