function AdminDashboard({ screen, setScreen, sidebarClass, cardClass, inputClass, globalLimits, setGlobalLimits, showToast }) { 
    // 1. Estados locais para armazenar os dados do banco
    const [listaCidadaos, setListaCidadaos] = React.useState([]); 
    const [listaEmpresas, setListaEmpresas] = React.useState([]); // ADICIONADO: Estado para as Empresas

    // 2. Carrega os cidadãos do Flask automaticamente assim que o Admin entra na tela 'citizens' 
    React.useEffect(() => { 
        if (screen === 'citizens') { 
        fetch('https://ecocircuit-2oas.onrender.com/api/admin/cidadaos') 
            .then(res => res.json()) 
            .then(dados => { 
            if (Array.isArray(dados)) { 
                setListaCidadaos(dados); 
            } 
            }) 
            .catch(err => { 
            console.error("Erro ao carregar cidadãos:", err); 
            showToast('Falha na comunicação com o servidor.', 'error'); 
            }); 
        } 
    }, [screen]);

    // ADICIONADO: Carrega as empresas do Flask automaticamente assim que entra na tela 'partners'
    React.useEffect(() => {
        if (screen === 'partners') {
        fetch('https://ecocircuit-2oas.onrender.com/api/admin/empresas')
            .then(res => res.json())
            .then(dados => {
            if (Array.isArray(dados)) {
                setListaEmpresas(dados);
            }
            })
            .catch(err => {
            console.error("Erro ao carregar empresas:", err);
            showToast('Falha ao carregar lista de parcerias corporativas.', 'error');
            });
        }
    }, [screen]);

    // 1. ADICIONADO: Estado para armazenar os contêineres/localizações
    const [listaConteineres, setListaConteineres] = React.useState([]);

    // 2. ADICIONADO: Carrega as localizações automaticamente ao entrar na tela 'iot'
    React.useEffect(() => {
        if (screen === 'iot') {
            fetch('https://ecocircuit-2oas.onrender.com/api/admin/conteineres')
                .then(res => res.json())
                .then(dados => {
                    if (Array.isArray(dados)) {
                        setListaConteineres(dados);
                    }
                })
                .catch(err => {
                    console.error("Erro ao carregar contêineres IoT:", err);
                    showToast('Falha ao carregar telemetria dos contêineres.', 'error');
                });
        }
    }, [screen]);

    // --- AÇÕES DO ADMINISTRADOR (REQUISIÇÕES HTTP) --- 

    // 3. Salva as margens globais de pontuação configuradas no painel 
    const handleSaveLimits = (e) => { 
        e.preventDefault(); 
        fetch('https://ecocircuit-2oas.onrender.com/api/admin/configuracao/limites', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(globalLimits) 
        }) 
        .then(resposta => { 
        if (resposta.ok) { 
            showToast('Margens de pontuação globais salvas e atualizadas com sucesso!', 'success'); 
        } else { 
            showToast('Erro ao persistir os novos limites no servidor.', 'error'); 
        } 
        }) 
        .catch(() => showToast('Erro de conexão com o servidor, tente novamente mais tarde.', 'error')); 
    }; 

    // 4. Altera a homologação (aprova ou rejeita) de contas de empresas parceiras [US05] 
    const handlePartnerStatusUpdate = (idEmpresa, novoStatus) => { 
        fetch(`https://ecocircuit-2oas.onrender.com/api/admin/empresas/${idEmpresa}/status`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status: novoStatus }) 
        }) 
        .then(resposta => { 
        if (resposta.ok) { 
            showToast(`Conta corporativa atualizada para o status: ${novoStatus.toUpperCase()}!`, 'success'); 
            
            // CORREÇÃO EFETIVA: Atualiza o estado das empresas localmente para redesenhar a linha na hora
            setListaEmpresas(prev => 
            prev.map(emp => emp.id === idEmpresa ? { ...emp, status: novoStatus.toUpperCase() } : emp)
            );
        } else { 
            showToast('Erro ao atualizar homologação do parceiro.', 'error'); 
        } 
        }) 
        .catch(() => showToast('Erro de conexão HTTP.', 'error')); 
    };

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
                            <button onClick={() => showToast('Processando e exportando relatório consolidado em formato PDF...', 'info')} className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow active:scale-95">Exportar Relatório (PDF)</button>
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
                        {listaConteineres.map((conteiner) => {
                            // Regra visual baseada na ocupação
                            const isCritico = conteiner.ocupacao >= 100;
                            
                            return (
                                <div 
                                    key={conteiner.id} 
                                    className={`p-5 rounded-3xl border transition-all ${
                                        isCritico ? `border-red-500/20 bg-red-500/5 iot-pulse-critical ${cardClass}` : cardClass
                                    }`}
                                >
                                    {/* Nome dinâmico vindo da coluna 'nome' do banco */}
                                    <h4 className={`font-extrabold text-sm ${isCritico ? 'text-red-400' : ''}`}>
                                        Contêiner #{String(conteiner.id).padStart(2, '0')} - {conteiner.nome}
                                    </h4>
                                    
                                    {/* Barra de progresso dinâmica */}
                                    <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ${isCritico ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${conteiner.ocupacao}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Status dinâmicos */}
                                    <span className={`text-[10px] block mt-1 ${isCritico ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                        {conteiner.ocupacao}% ocupado | {conteiner.status_operacional}
                                    </span>
                                    
                                    {/* Botão de ação aparece apenas para contêineres cheios */}
                                    {isCritico && (
                                        <button 
                                            onClick={() => showToast(`Logística acionada para ${conteiner.nome}! Ordem de esvaziamento despachada.`, 'success')} 
                                            className="w-full mt-3 py-2.5 bg-red-500 text-white font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg"
                                        >
                                            Solicitar Esvaziamento
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {listaConteineres.length === 0 && (
                            <p className="text-xs text-gray-400 col-span-2">Nenhum contêiner monitorado no momento.</p>
                        )}
                    </div>
                )}

                
                {screen === 'partners' && ( 
                    <div className={`p-5 rounded-3xl border overflow-hidden view-transition ${cardClass}`}> 
                    <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-zinc-400">Fila de Parcerias Registradas</h3> 
                    <table className="w-full text-xs text-left"> 
                        <thead> 
                        <tr className="border-b border-zinc-700/20 text-gray-400 uppercase text-[10px]"> 
                            <th className="pb-2">EMPRESA</th> 
                            <th className="pb-2">CNPJ</th> 
                            <th className="pb-2 text-center">SITUAÇÃO ATUAL</th> 
                            <th className="pb-2 text-right">AÇÕES</th> 
                        </tr> 
                        </thead> 
                        <tbody> 
                        {listaEmpresas.length > 0 ? ( 
                            listaEmpresas.map((empresa) => ( 
                            <tr key={empresa.id} className="border-b border-zinc-700/10 hover:bg-slate-500/5 transition-colors"> 
                                <td className="py-3 font-bold">{empresa.nome}</td> 
                                <td className="py-3 font-mono text-gray-400">{empresa.cnpj}</td> 
                                <td className="py-3 text-center"> 
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${ 
                                    empresa.status === 'APROVADA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                    empresa.status === 'REJEITADA' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                }`}> 
                                    {empresa.status} 
                                </span> 
                                </td> 
                                <td className="py-3 text-right space-x-2"> 
                                {empresa.status === 'PENDENTE' ? ( 
                                    <React.Fragment> 
                                    <button 
                                        onClick={() => handlePartnerStatusUpdate(empresa.id, 'aprovada')} 
                                        className="bg-emerald-500 text-black px-3 py-1 rounded text-xs font-bold cursor-pointer hover:bg-emerald-400 transition-all active:scale-95"
                                    > 
                                        Aprovar 
                                    </button> 
                                    <button 
                                        onClick={() => handlePartnerStatusUpdate(empresa.id, 'rejeitada')} 
                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold cursor-pointer hover:bg-red-400 transition-all active:scale-95"
                                    > 
                                        Rejeitar 
                                    </button> 
                                    </React.Fragment> 
                                ) : ( 
                                    <span className="text-gray-500 italic text-[11px]">Homologação Concluída</span> 
                                )} 
                                </td> 
                            </tr> 
                            )) 
                        ) : ( 
                            <tr> 
                            <td colSpan="4" className="py-6 text-center text-gray-400 italic"> 
                                Nenhuma empresa parceira cadastrada na bacia de dados. 
                            </td> 
                            </tr> 
                        )} 
                        </tbody> 
                    </table> 
                    </div> 
                )} 
                
                {screen === 'config' && (
                    <div className={`p-6 rounded-3xl border max-w-sm space-y-4 ${cardClass}`}>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Configurações Gerais</h3>
                        
                        <form className="space-y-4" onSubmit={handleSaveLimits}>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Limite Mínimo (Pontos)</label>
                                <input type="number" value={globalLimits.min} onChange={(e) => setGlobalLimits(prev => ({...prev, min: parseInt(e.target.value) || 0}))} className={`w-full p-2 text-xs rounded-xl ${inputClass}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Limite Máximo (Pontos)</label>
                                <input type="number" value={globalLimits.max} onChange={(e) => setGlobalLimits(prev => ({...prev, max: parseInt(e.target.value) || 0}))} className={`w-full p-2 text-xs rounded-xl ${inputClass}`} />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer">
                                Salvar Parâmetros
                            </button>
                        </form>
                    </div>
                )}
                
                {screen === 'citizens' && (
                    <div className={`p-5 rounded-3xl border overflow-hidden view-transition ${cardClass}`}> 
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
                        {listaCidadaos.length > 0 ? (
                            listaCidadaos.map((cidadao) => (
                            <tr key={cidadao.id} className="border-b border-zinc-700/10 hover:bg-slate-500/5 transition-colors"> 
                                <td className="py-3 font-bold">{cidadao.nome}</td> 
                                <td className="py-3 text-gray-400">{cidadao.email}</td> 
                                <td className="py-3">
                                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">
                                    Ativo
                                </span>
                                </td> 
                            </tr> 
                            ))
                        ) : (
                            <tr>
                            <td colSpan="3" className="py-6 text-center text-gray-400 italic">
                                Nenhum cidadão cadastrado na base de dados até o momento.
                            </td>
                            </tr>
                        )}
                        </tbody> 
                    </table> 
                    </div> 
                )}
            </main>
        </div>
    );
}