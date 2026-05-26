function Header({ theme, setTheme, showDevPanel, setShowDevPanel, setIsAuthenticated }) {
    return (
        <header className="w-full h-16 bg-[#0f1217] text-white flex items-center justify-between px-6 shadow-xl border-b border-zinc-800/80">
            <div className="flex items-center gap-3 font-bold text-lg cursor-pointer" onClick={() => setIsAuthenticated(false)}>
                <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <i className="fa-solid fa-leaf text-emerald-400 text-sm"></i>
                </div>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">EcoCircuit</span>
            </div>

            <button 
                onClick={() => setShowDevPanel(prev => !prev)}
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2 border border-zinc-700/60 transition-all cursor-pointer active:scale-95"
            >
                <i className="fa-solid fa-circle-nodes"></i>
                <span>{showDevPanel ? 'Ocultar Inspecionador' : ' 🔬 Painel de Controle (Ver Telas)'}</span>
            </button>

            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-800/80 hover:bg-zinc-700 text-emerald-400 cursor-pointer transition-all active:scale-90"
                >
                    <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-indigo-400' : 'fa-sun text-amber-400'}`}></i>
                </button>
            </div>
        </header>
    );
}