function EmpresaDashboard({ screen, setScreen, sidebarClass, cardClass, inputClass, globalLimits, showToast }) {
    
    const handleCreateCampaign = (e) => {
        e.preventDefault();
        
        const formulario = new FormData(e.target);
        const dadosCampanha = Object.fromEntries(formulario);
        const pontos = parseInt(dadosCampanha.pontos_necessarios); 

        if (pontos < globalLimits.min || pontos > globalLimits.max) { 
            showToast(`Recusa de Regra (RN003): O valor inserido está fora das margens reguladas (${globalLimits.min} a ${globalLimits.max} pts).`, 'error'); 
            return;
        } 

        fetch('http://localhost:8000/api/ofertas/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCampanha)
        })
        .then(resposta => {
            if (resposta.ok) {
                showToast('Campanha publicada com sucesso e enviada para homologação!', 'success');
                e.target.reset();
            } else {
                showToast('Erro ao publicar a campanha no servidor.', 'error');
            }
        })
        .catch(erro => {
            console.error("Erro:", erro);
            showToast('Erro de conexão com o servidor Python.', 'error');
        });
    };

    return (
        <div className="flex-1 flex view-transition">
            <aside className={`w-64 p-5 space-y-4 border-r ${sidebarClass}`}>
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Painel Corporativo</h3>
                <nav className="space-y-1.5">
                    <button onClick={() => setScreen('status')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'status' ? 'bg-blue-500/10 text-blue-400 border-blue-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-building-circle-check"></i>
                        <span>Status do Perfil</span>
                    </button>
                    <button onClick={() => setScreen('campaign')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'campaign' ? 'bg-blue-500/10 text-blue-400 border-blue-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-tags"></i>
                        <span>Criar Ofertas</span>
                    </button>
                    <button onClick={() => setScreen('history')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 border-l-4 ${screen === 'history' ? 'bg-blue-500/10 text-blue-400 border-blue-500 shadow-sm' : 'text-gray-400 border-transparent hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:shadow-sm'}`}>
                        <i className="fa-solid fa-receipt"></i>
                        <span>Histórico Resgates</span>
                    </button>
                </nav>
            </aside>
            <main className="flex-1 p-8 space-y-5">
                {screen === 'status' && (
                    <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2 shadow-xl">
                        <h2 className="text-sm font-bold text-amber-500"><i className="fa-solid fa-hourglass-half mr-1.5"></i>Status Cadastral: PENDENTE DE APROVAÇÃO</h2>
                        <p className="text-xs text-gray-400 leading-relaxed">Sua conta corporativa foi submetida com sucesso. Os administradores da Codexa estão avaliando as diretrizes técnicas antes da publicação dos cupons virtuais.</p>
                    </div>
                )}
                
                {screen === 'campaign' && (
                    <div className={`p-6 rounded-3xl border max-w-md space-y-4 ${cardClass}`}>
                        <h3 className="font-bold text-base tracking-tight">Criar Oferta de Desconto</h3>
                        
                        <form className="space-y-4" onSubmit={handleCreateCampaign}>
                            <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Nome da Oferta</label>
                                <input required type="text" name="titulo_oferta" className={`w-full p-2.5 text-xs rounded-xl ${inputClass}`} placeholder="Ex: 25% OFF em Periféricos" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Valor Exigido em Pontos</label>
                                <input required type="number" name="pontos_necessarios" className={`w-full p-2.5 text-xs rounded-xl ${inputClass}`} placeholder={`Margem autorizada: de ${globalLimits.min} a ${globalLimits.max}`} />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-all shadow-md">
                                Publicar Campanha
                            </button>
                        </form>
                    </div>
                )}
                
                {screen === 'history' && (
                    <div className={`p-5 rounded-3xl border overflow-hidden ${cardClass}`}>
                        <h3 className="font-bold text-sm mb-4">Cupons Utilizados por Clientes</h3>
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-zinc-700/20 text-gray-400 uppercase text-[10px]">
                                    <th className="pb-2">CÓDIGO ÚNICO</th>
                                    <th className="pb-2">OFERTA</th>
                                    <th className="pb-2">UTILIZAÇÃO</th>
                                    <th className="pb-2">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-700/10">
                                    <td className="py-3 font-mono font-bold">EC-8831-ABC</td>
                                    <td className="py-3">Cupom 20% OFF Tech</td>
                                    <td className="py-3">24/05/2026</td>
                                    <td className="py-3 text-emerald-500 font-bold">Consumido</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}