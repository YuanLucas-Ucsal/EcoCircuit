function DevPanel({ injectAppState }) {
    return (
        <div className="w-full bg-[#0b0d12] text-white border-b border-zinc-800/80 p-4 shadow-2xl overflow-x-auto">
            <div className="max-w-6xl mx-auto flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
                <div className="text-xs">
                    <span className="text-emerald-400 font-black uppercase tracking-wider text-[10px] block">Inspecionador de Interfaces</span>
                    <p className="text-zinc-400">Clique para injetar estados específicos instantaneamente:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 flex gap-1 items-center">
                        <span className="text-[9px] font-bold text-emerald-400 px-1 uppercase">Cidadão:</span>
                        <button onClick={() => injectAppState('cidadao', 'mapa')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold transition-all">Mapa</button>
                        <button onClick={() => injectAppState('cidadao', 'qr')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold transition-all">QR</button>
                        <button onClick={() => injectAppState('cidadao', 'category')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold transition-all">Categorias</button>
                        <button onClick={() => injectAppState('cidadao', 'photo')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold transition-all">Foto</button>
                        <button onClick={() => injectAppState('cidadao', 'loading')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold text-amber-400">Skeleton</button>
                        <button onClick={() => injectAppState('cidadao', 'success')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold text-emerald-400">Sucesso</button>
                        <button onClick={() => injectAppState('cidadao', 'carteira')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Carteira</button>
                    </div>
                    <div className="bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 flex gap-1 items-center">
                        <span className="text-[9px] font-bold text-blue-400 px-1 uppercase">Empresa:</span>
                        <button onClick={() => injectAppState('empresa', 'status')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold text-amber-400">Pendente</button>
                        <button onClick={() => injectAppState('empresa', 'campaign')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Nova Oferta</button>
                        <button onClick={() => injectAppState('empresa', 'history')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Resgates</button>
                    </div>
                    <div className="bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 flex gap-1 items-center">
                        <span className="text-[9px] font-bold text-purple-400 px-1 uppercase">Admin:</span>
                        <button onClick={() => injectAppState('admin', 'bi')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">BI Dashboard</button>
                        <button onClick={() => injectAppState('admin', 'iot')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold text-red-400">IoT Monitor</button>
                        <button onClick={() => injectAppState('admin', 'partners')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Fila Aprovação</button>
                        <button onClick={() => injectAppState('admin', 'config')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Limites</button>
                        <button onClick={() => injectAppState('admin', 'citizens')} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded font-semibold">Cidadãos</button>
                    </div>
                </div>
            </div>
        </div>
    );
}