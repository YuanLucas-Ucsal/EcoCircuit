function AdminDashboard({ screen, setScreen, sidebarClass, cardClass, inputClass, globalLimits, setGlobalLimits }) {
    return (
        <div className="flex-1 flex view-transition">
            <aside className={`w-64 p-5 space-y-4 border-r ${sidebarClass}`}>
                <div className="space-y-0.5">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Codexa Admin</h3>
                    <div className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 w-fit">Nível Global</div>
                </div>
                <nav className="space-y-1.5">
                    <button onClick={() => setScreen('bi')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'bi' ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-chart-pie"></i>
                        <span>Business Intelligence</span>
                    </button>
                    <button onClick={() => setScreen('iot')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'iot' ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-microchip"></i>
                        <span>Monitoramento IoT</span>
                    </button>
                    <button onClick={() => setScreen('partners')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'partners' ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-building-shield"></i>
                        <span>Fila de Parceiros</span>
                    </button>
                    <button onClick={() => setScreen('config')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'config' ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-sliders"></i>
                        <span>Configurar Limites</span>
                    </button>
                    <button onClick={() => setScreen('citizens')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'citizens' ? 'bg-purple-500/10 text-purple-400 border-purple-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-users"></i>
                        <span>Lista de Cidadãos</span>
                    </button>
                </nav>
            </aside>
            <main className="flex-1 p-8 space-y-5">
                {screen === 'bi' && (
                    <div className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <h3 className="font-extrabold text-base tracking-tight">Massa Total de Resíduos Coletados</h3>
                            <button onClick={() => alert('Exportando relatório corporativo em PDF...')} className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow active:scale-95">Exportar Relatório (PDF)</button>
                        </div>
                        <div className="h-36 flex items-end justify-around border-b border-zinc-700/20 pb-1">
                            <div className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl" style={{height: '45%'}} title="450 Kg"></div>
                            <div className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl" style={{height: '65%'}} title="700 Kg"></div>
                            <div className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl" style={{height: '95%'}} title="950 Kg"></div>
                        </div>
                    </div>
                )}
                {screen === 'iot' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className={`p-5 rounded-3xl border ${cardClass}`}>
                            <h4 className="font-extrabold text-sm">Contêiner #01 - Shopping Salvador</h4>
                            <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '72%'}}></div></div>
                            <span className="text-[10px] text-gray-400 block mt-1">72% ocupado | Operação Estável</span>
                        </div>
                        <div className={`p-5 rounded-3xl border iot-pulse-critical ${cardClass}`}>
                            <h4 className="font-extrabold text-sm text-red-400">Contêiner #04 - Pituba Supermercado</h4>
                            <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-red-500" style={{width: '100%'}}></div></div>
                            <span className="text-[10px] text-red-400 font-bold block mt-1">100% preenchido | PORTA BLOQUEADA</span>
                            <button onClick={() => alert('Solicitação de esvaziamento enviada.')} className="w-full mt-3 py-2.5 bg-red-500 text-white font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg">Solicitar Esvaziamento</button>
                        </div>
                    </div>
                )}
                {screen === 'partners' && (
                    <div className={`p-5 rounded-3xl border overflow-hidden ${cardClass}`}>
                        <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-zinc-400">Fila de Parcerias Pendentes</h3>
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-zinc-700/20 text-gray-400 uppercase text-[10px]">
                                    <th className="pb-2">EMPRESA</th>
                                    <th className="pb-2">CNPJ</th>
                                    <th className="pb-2">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-700/10">
                                    <td className="py-3 font-bold">Bahia Eletro S.A.</td>
                                    <td className="py-3 font-mono">12.345.678/0001-99</td>
                                    <td className="py-3 space-x-2">
                                        <button onClick={() => alert('Parceria aprovada.')} className="bg-emerald-500 text-black px-3 py-1 rounded text-xs font-bold cursor-pointer">Aprovar</button>
                                        <button onClick={() => alert('Rejeitado')} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold cursor-pointer">Rejeitar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {screen === 'config' && (
                    <div className={`p-6 rounded-3xl border max-w-sm space-y-4 ${cardClass}`}>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Configurações Gerais</h3>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Limite Mínimo (Pontos)</label>
                            <input type="number" value={globalLimits.min} onChange={(e) => setGlobalLimits(prev => ({...prev, min: parseInt(e.target.value) || 0}))} className={`w-full p-2 text-xs rounded-xl ${inputClass}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Limite Máximo (Pontos)</label>
                            <input type="number" value={globalLimits.max} onChange={(e) => setGlobalLimits(prev => ({...prev, max: parseInt(e.target.value) || 0}))} className={`w-full p-2 text-xs rounded-xl ${inputClass}`} />
                        </div>
                        <button onClick={() => alert('Limites salvos')} className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl">Salvar Parâmetros</button>
                    </div>
                )}
                {screen === 'citizens' && (
                    <div className={`p-5 rounded-3xl border overflow-hidden ${cardClass}`}>
                        <h3 className="font-bold text-sm mb-4">Cidadãos Ativos</h3>
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-zinc-700/20 text-gray-400 uppercase text-[10px]">
                                    <th className="pb-2">NOME</th>
                                    <th className="pb-2">E-MAIL</th>
                                    <th className="pb-2">SITUAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-700/10">
                                    <td className="py-3 font-bold">Rafael Campos Sampaio</td>
                                    <td className="py-3 text-gray-400">rafael.sampaio@exemplo.com</td>
                                    <td className="py-3"><span className="text-emerald-500 font-bold">Ativo</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}