import Link from "next/link";

export function SituacionesEmergentes() {
  return (
    <Link href="/protocolos" className="group block mb-6">
      <div
        className="
        bg-gradient-to-r from-blue-50 to-indigo-50
        border border-blue-200
        rounded-xl
        p-6
        hover:shadow-sm
        transition-shadow
      "
      >
        <div className="flex items-center justify-between text-gray-700">
          <span
            className="
  text-[24px]
  font-extrabold
  text-indigo-700
  relative
  after:content-['']
  after:absolute
  after:left-0
  after:-bottom-1
  after:w-full
  after:h-[3px]
  after:bg-indigo-500/30
  after:rounded-full
"
          >
            Situaciones emergentes
          </span>

          <span
            className="
            text-indigo-600
            font-bold
            text-2xl
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
          >
            -&gt;
          </span>
        </div>
      </div>
    </Link>
  );
}
