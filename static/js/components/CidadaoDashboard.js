function CidadaoDashboard({ 
  screen, 
  setScreen, 
  userPoints, 
  cardClass, 
  inputClass, 
  selectedContainer, 
  setSelectedContainer, 
  runPhotoValidationTimer, 
  triggerVoucherRedemptionFlow, 
  activeWalletTab, 
  setActiveWalletTab, 
  myCoupons, // Recebido do pai
  setMyCoupons, // Certifique-se de passar o setter do useState do pai por prop aqui!
  userId 
}) { 

    const [pontosColeta, setPontosColeta] = React.useState([]); 
    const [listaOfertas, setListaOfertas] = React.useState([]); 

    // 2. Busca os pontos da API quando a tela do mapa for carregada
    React.useEffect(() => { 
        if (screen === 'mapa') { 
        fetch('https://ecocircuit-2oas.onrender.com/api/localizacoes') 
            .then(res => res.json()) 
            .then(dados => { 
            if (Array.isArray(dados)) { 
                setPontosColeta(dados); 
            } 
            }) 
            .catch(err => console.error("Erro ao carregar marcadores do banco:", err)); 
        } 
    }, [screen]); 

    // 3. Renderização e efeito do Leaflet Map
    React.useEffect(() => { 
        if (screen === 'mapa') { 
        const mapContainer = L.DomUtil.get('mapa-real-core'); 
        if (mapContainer !== null) { 
            mapContainer._leaflet_id = null; 
        } 
        const map = L.map('mapa-real-core', { zoomControl: false }).setView([-12.9796, -38.4539], 14); 
        L.control.zoom({ position: 'bottomright' }).addTo(map); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap' 
        }).addTo(map); 

        pontosColeta.forEach((ponto) => { 
            const isLotado = ponto.volume === 100; 
            const marker = L.marker([ponto.latitude, ponto.longitude]).addTo(map); 
            if (isLotado) { 
            marker.bindPopup(`<b class='text-red-500'>${ponto.nome}</b><br>🚨 LOTADO (100%)`); 
            } else { 
            marker.bindPopup(`<b>${ponto.nome}</b><br>Capacidade: ${ponto.volume}%`).openPopup(); 
            } 
            marker.on('click', () => { 
            setSelectedContainer({ name: ponto.nome, location: ponto.endereco, volume: ponto.volume, blocked: isLotado }); 
            }); 
        }); 
        setTimeout(() => { map.invalidateSize(); }, 300); 
        return () => { map.remove(); }; 
        } 
    }, [screen, pontosColeta]); 

    // 4. Carrega as ofertas aprovadas do banco ao montar a tela
    React.useEffect(() => { 
        fetch('https://ecocircuit-2oas.onrender.com/api/ofertas') 
        .then(res => res.json()) 
        .then(dados => { 
            if (Array.isArray(dados)) setListaOfertas(dados); 
        }) 
        .catch(err => console.error("Erro ao carregar ofertas:", err)); 
    }, []); 

    // 5. REGRA NOVA: Carrega apenas os vouchers REAIS do cidadão direto do banco
    React.useEffect(() => { 
        if (screen === 'carteira') { 
        fetch(`https://ecocircuit-2oas.onrender.com/api/cidadaos/${userId || 1}/vouchers`) 
            .then(res => res.json()) 
            .then(dados => { 
            if (Array.isArray(dados) && typeof setMyCoupons === 'function') { 
                setMyCoupons(dados); 
            } 
            }) 
            .catch(err => console.error("Erro carteira:", err)); 
        } 
    }, [screen, userId, setMyCoupons]); 

    // Função adaptada para enviar os dados corretos ao Flask
    const lidarComDescarte = async () => {
        setScreen('loading'); // Ativa os esqueletos piscantes na interface

        try {
        const response = await fetch('https://ecocircuit-2oas.onrender.com/api/cidadaos/descarte-sucesso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            usuario_id: userId || 1, // Passa o ID 1 da linha da sua imagem
            pontos: 350
            })
        });

        const dados = await response.json();

        if (response.ok && dados.sucesso) {
            // Altera o estado superior do React reativamente com os pontos salvos pelo banco
            if (typeof setUserPoints === 'function') {
            setUserPoints(dados.novo_saldo);
            }

            // Aguarda a animação e redireciona para a tela de sucesso
            setTimeout(() => {
            setScreen('success');
            }, 1500);

        } else {
            alert(`Erro retornado pela rota do Flask: ${dados.erro}`);
            setScreen('photo');
        }
        } catch (erro) {
        console.error("Erro de conexão de rede:", erro);
        alert("Não foi possível registrar o descarte no banco. Verifique se o servidor Flask caiu.");
        setScreen('photo');
        }
    };

    return (
        <div className="flex-1 flex flex-col p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6 view-transition">
            
            <div className={`p-6 rounded-3xl border flex flex-wrap justify-between items-center gap-4 ${cardClass}`}>
                <div className="space-y-0.5">
                    <h2 className="text-xl font-black tracking-tight">Painel de Coleta e Prêmios</h2>
                    <p className="text-xs text-gray-400">Gerenciamento reativo de descarte sustentável</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-2xl text-center shadow-inner">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider mb-0.5">Seu Saldo</span>
                        <strong className="text-emerald-500 text-xl font-black">{userPoints} pts</strong>
                    </div>
                </div>
            </div>

            <nav className={`p-2 rounded-2xl border flex gap-1 items-center overflow-x-auto ${cardClass}`}>
                <button onClick={() => setScreen('mapa')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${screen === 'mapa' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:text-emerald-400'}`}>
                    <i className="fa-solid fa-map-location-dot text-sm"></i>
                    <span>Mapa de Coleta</span>
                </button>
                <button onClick={() => setScreen('qr')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${['qr', 'category', 'photo', 'loading', 'success'].includes(screen) ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:text-emerald-400'}`}>
                    <i className="fa-solid fa-qrcode text-sm"></i>
                    <span>Registrar Descarte</span>
                </button>
                <button onClick={() => setScreen('carteira')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${screen === 'carteira' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:bg-slate-500/5 dark:hover:bg-zinc-500/10 hover:text-emerald-400'}`}>
                    <i className="fa-solid fa-wallet text-sm"></i>
                    <span>Minha Carteira</span>
                </button>
            </nav>

            {screen === 'mapa' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 view-transition">
                    <div className="lg:col-span-2 h-80 rounded-3xl relative overflow-hidden border border-zinc-800/20 shadow-inner bg-zinc-900 z-10" id="mapa-real-core"></div>
                    <div>
                        {selectedContainer ? (
                            <div className={`p-5 rounded-3xl border space-y-3.5 h-full flex flex-col justify-between ${cardClass}`}>
                                <div>
                                    <h4 className="font-extrabold text-base tracking-tight">{selectedContainer.name}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{selectedContainer.location}</p>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Capacidade Volumétrica</span>
                                            <span className={selectedContainer.blocked ? 'text-red-400' : 'text-emerald-400'}>{selectedContainer.volume}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${selectedContainer.blocked ? 'bg-red-500' : 'bg-emerald-400'}`} style={{width: `${selectedContainer.volume}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                                {selectedContainer.blocked ? (
                                    <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl font-semibold leading-relaxed">
                                        Dispositivo travado por segurança. A bacia física de armazenamento atingiu 100%.
                                    </div>
                                ) : (
                                    <button onClick={() => setScreen('qr')} className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all">Ir para o Bocal</button>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center border-2 border-dashed border-zinc-700/30 rounded-3xl text-gray-400 text-xs flex flex-col items-center justify-center h-full gap-2">
                                <i className="fa-solid fa-hand-pointer text-lg text-emerald-500/20"></i>
                                <span>Selecione um ponto de coleta física no mapa.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {screen === 'qr' && (
                <div className={`max-w-md mx-auto w-full p-6 rounded-3xl border text-center space-y-4 ${cardClass}`}>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Leitor de QR Code Contêiner</h3>
                    <div className="w-full h-44 bg-zinc-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-800">
                        <div className="absolute w-full h-0.5 bg-emerald-400 left-0 qr-laser-line shadow-[0_0_8px_#10b981]"></div>
                        <i className="fa-solid fa-camera text-2xl text-zinc-800"></i>
                    </div>
                    <input type="text" placeholder="Código Alfanumérico Manual" className={`w-full p-2.5 text-xs text-center rounded-xl outline-none ${inputClass}`} />
                    <button onClick={() => setScreen('category')} className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs uppercase rounded-xl cursor-pointer active:scale-95 transition-all">Acessar Painel</button>
                </div>
            )}

            {screen === 'category' && (
                <div className="space-y-4 text-center view-transition">
                    <h3 className="text-lg font-bold tracking-tight">O que você vai descartar hoje?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['Pilhas e Baterias', 'Cabos e Fios', 'Celulares', 'Periféricos', 'TVs e Monitores', 'Computadores'].map((cat) => (
                            <div key={cat} onClick={() => setScreen('photo')} className={`p-5 text-center rounded-2xl border cursor-pointer transform hover:-translate-y-0.5 transition-all hover:border-emerald-500 flex flex-col items-center justify-center gap-3 ${cardClass}`}>
                                <i className="fa-solid fa-boxes-packing text-emerald-400 text-sm"></i>
                                <span className="text-xs font-bold">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {screen === 'photo' && ( 
                <div className={`max-w-md mx-auto w-full p-6 rounded-3xl border text-center space-y-4 ${cardClass}`}> 
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Validação por Imagem</h3> 
                
                {/* CORREÇÃO AQUI: Mudado para apontar para a nossa nova função interna */}
                <div onClick={lidarComDescarte} className="w-full h-44 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-900/5 hover:border-emerald-500 transition-all"> 
                    <i className="fa-solid fa-camera-retro text-xl text-emerald-400"></i> 
                    <span className="text-xs text-gray-400 font-bold">Simular Envio de Foto do Objeto</span> 
                </div> 
                </div> 
            )}

            {screen === 'loading' && ( 
                <div className={`max-w-md mx-auto w-full p-6 rounded-3xl border text-center space-y-4 ${cardClass}`}> 
                <h4 className="font-bold text-emerald-400 animate-pulse text-xs uppercase tracking-widest">Aguarde, validando seu descarte junto ao contêiner...</h4> 
                <div className="space-y-2.5"> 
                    <div className="h-10 w-full skeleton-pulse-block rounded-xl"></div> 
                    <div className="h-4 w-3/4 skeleton-pulse-block rounded-xl mx-auto"></div> 
                    <div className="h-16 w-full skeleton-pulse-block rounded-xl"></div> 
                </div> 
                </div> 
            )} 

            {screen === 'success' && ( 
                <div className="max-w-md mx-auto w-full p-6 rounded-3xl border text-center space-y-4 border-emerald-500/20 bg-emerald-500/5 shadow-xl view-transition"> 
                <i className="fa-solid fa-circle-check text-4xl text-emerald-400"></i> 
                <h3 className="text-lg font-black tracking-tight">Descarte Aprovado!</h3> 
                <div className="py-2.5 bg-zinc-950/20 rounded-xl font-black text-2xl text-emerald-400">+ 350 pontos</div> 
                <button onClick={() => setScreen('carteira')} className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs uppercase rounded-xl cursor-pointer">Acessar Carteira</button> 
                </div> 
            )}

            {screen === 'carteira' && ( 
                <div className="space-y-4 view-transition"> 
                <div className="flex gap-4 border-b border-zinc-800/10 pb-1.5"> 
                    <button onClick={() => setActiveWalletTab('catalog')} className={`pb-1.5 text-xs font-bold transition-all cursor-pointer ${activeWalletTab === 'catalog' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-gray-400'}`}>Cupons de Desconto</button> 
                    <button onClick={() => setActiveWalletTab('my-coupons')} className={`pb-1.5 text-xs font-bold transition-all cursor-pointer ${activeWalletTab === 'my-coupons' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-gray-400'}`}>Meus Cupons ({myCoupons.length})</button> 
                </div> 

                {activeWalletTab === 'catalog' ? ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    {listaOfertas.map(oferta => ( 
                        <div key={oferta.id} className={`p-4 rounded-2xl border flex justify-between items-center ${cardClass}`}> 
                        <div> 
                            <h4 className="font-bold text-xs">{oferta.titulo}</h4> 
                            <p className="text-[10px] text-zinc-400 font-medium">Por: {oferta.empresa}</p> 
                            <p className="text-[11px] text-emerald-400 font-bold mt-0.5">Custo: {oferta.pontos_necessarios} pontos</p> 
                        </div> 
                        <button 
                            onClick={() => triggerVoucherRedemptionFlow(oferta.id, oferta.titulo, oferta.pontos_necessarios)} 
                            disabled={userPoints < oferta.pontos_necessarios} 
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow ${ 
                                userPoints >= oferta.pontos_necessarios 
                                ? 'bg-emerald-500 text-black cursor-pointer active:scale-95' 
                                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                            }`}
                        > 
                            {userPoints >= oferta.pontos_necessarios ? 'Resgatar' : 'Bloqueado'} 
                        </button>
                        </div> 
                    ))} 
                    {listaOfertas.length === 0 && <p className="text-xs text-gray-500">Nenhuma oferta disponível no momento.</p>} 
                    </div> 
                ) : ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    {myCoupons.map(c => ( 
                        <div key={c.id} className={`p-4 rounded-2xl border border-l-4 border-l-emerald-400 flex justify-between items-center ${cardClass}`}> 
                        <div className="space-y-1"> 
                            {/* Aqui vai renderizar o texto correto do c.name vindo do banco */}
                            <h4 className="font-bold text-xs text-zinc-400">{c.name}</h4> 
                            <p className="text-[11px] font-mono text-gray-400">HASH: <span className="bg-zinc-800 text-white px-2 py-0.5 rounded font-bold">{c.code}</span></p> 
                            <p className="text-[10px] text-amber-500 font-medium">Expira: {c.expiry}</p> 
                        </div> 
                        </div> 
                    ))} 
                    {myCoupons.length === 0 && <p className="text-xs text-gray-500">Você ainda não possui cupons resgatados.</p>} 
                    </div> 
                )} 
                </div> 
            )}
        </div>
    );
}