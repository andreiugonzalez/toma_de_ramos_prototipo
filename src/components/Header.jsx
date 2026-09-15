export default function Header() {
  return (
    <header className="bg-gradient-to-r from-ucenslate via-ucenslate-light to-ucenslate text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="text-ucenslate font-black text-xl leading-tight text-center">
                <div className="tracking-tighter">UCEN</div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold tracking-tight">Universidad Central de Chile</div>
              <div className="text-blue-100 text-sm">Facultad de Ingeniería y Tecnología</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs">
                  <div className="text-blue-100">Cierre toma de ramos en:</div>
                  <div className="font-mono font-bold text-sm text-white">12:45:30</div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center font-bold">
                JS
              </div>
            </div>
            <div className="text-xs text-blue-100 hidden md:block">
              <span className="font-semibold text-white">Periodo:</span> 2025-02 / 1 ·
              <span className="font-semibold text-white"> Expediente:</span> 202118457
            </div>
          </div>
        </div>

        <div className="pb-4 md:hidden">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-100">Plan:</span>
              <span className="font-semibold">Ing. en Programación 2023</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-blue-100">Cierre en:</span>
              <span className="font-mono font-bold text-white">12:45:30</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
