const { useState, useEffect } = React;

function EcoCircuitApp() {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('cidadao');
  const [cidadaoScreen, setCidadaoScreen] = useState('mapa');
  const [empresaScreen, setEmpresaScreen] = useState('status');
  const [adminScreen, setAdminScreen] = useState('bi');
  
  // SOLUÇÃO DO COMPILADOR: Declarado o estado do ID do cidadão logado (Padrão 1 para testes locais)
  const [userId, setUserId] = useState(1);
  const [userPoints, setUserPoints] = useState(0); 
  const [myCoupons, setMyCoupons] = useState([]); 

  const [globalLimits, setGlobalLimits] = useState({ min: 500, max: 5000 });
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [activeWalletTab, setActiveWalletTab] = useState('catalog');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [pendingVoucher, setPendingVoucher] = useState(null);

  // Sistema de Notificações Reativo (Toasts)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-[#0a0c10] text-gray-100' : 'bg-[#f1f5f9] text-slate-900';
  }, [theme]);

  // REGRA NOVA: Sincroniza o saldo do banco de dados na inicialização do aplicativo pós-autenticação
  useEffect(() => {
    if (isAuthenticated && userRole === 'cidadao' && userId) {
      fetch(`https://ecocircuit-2oas.onrender.com/api/cidadaos/${userId}/perfil`)
        .then(res => res.json())
        .then(dados => {
          if (dados.pontuacao !== undefined) setUserPoints(dados.pontuacao);
        })
        .catch(err => console.error("Erro ao sincronizar saldo inicial do banco:", err));
    }
  }, [isAuthenticated, userRole, userId]);

  const runPhotoValidationTimer = () => {
    setCidadaoScreen('loading');
    setTimeout(() => {
      setUserPoints(prev => prev + 350);
      setCidadaoScreen('success');
      showToast('Descarte processado com sucesso! +350 pontos na carteira.', 'success');
    }, 2200);
  };

  const triggerVoucherRedemptionFlow = (id, name, cost) => {
    if (userPoints < cost) {
      showToast('Margem de pontuação insuficiente para efetuá-lo o resgate deste cupom.', 'error');
      return;
    }
    setPendingVoucher({ id, name, cost });
    setShowVoucherModal(true);
  };

  const confirmVoucherRedemption = async () => {
    try {
      const response = await fetch('https://ecocircuit-2oas.onrender.com/api/vouchers/resgatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oferta_id: pendingVoucher.id,
          usuario_id: userId // Puxa dinamicamente do useState declarado acima
        })
      });

      const dados = await response.json();

      if (response.ok && dados.sucesso) {
        setUserPoints(dados.novo_saldo);
        setMyCoupons(prev => [...prev, dados.voucher]); 
        
        setShowVoucherModal(false);
        setPendingVoucher(null);
        setCidadaoScreen('carteira');
        setActiveWalletTab('my-coupons');
        showToast('Cupom resgatado com sucesso! Verifique sua carteira.', 'success');
      } else {
        showToast(`Erro no servidor: ${dados.erro}`, 'error');
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      showToast('Erro ao processar resgate no servidor Python.', 'error');
    }
  };

  // Tokens de Estilização Dinâmica
  const cardClass = theme === 'dark' ? 'bg-[#151923] border-zinc-800 text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-200 text-slate-900 shadow-[0_15px_35px_rgba(148,163,184,0.1)]';
  const inputClass = theme === 'dark' ? 'bg-[#1c212c] text-white border-zinc-700 focus:border-emerald-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-emerald-500';
  const sidebarClass = theme === 'dark' ? 'bg-[#0f1218] border-r border-zinc-800/40' : 'bg-white border-r border-slate-200/80';

  return (
    <div className="min-h-screen flex flex-col relative z-10 flex-1">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-8%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-400/5 blur-3xl"></div>
        <div className="absolute bottom-[-12%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-emerald-500/10 to-emerald-300/5 blur-3xl"></div>
      </div>

      <div className="sticky top-0 z-50 w-full flex flex-col">
        <Header theme={theme} setTheme={setTheme} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userRole={userRole} />
      </div>

      <div className="flex-1 flex flex-col relative z-10 w-full">
        <div className="flex-1 flex flex-col md:flex-row w-full justify-center items-center">
          {!isAuthenticated ? (
            <AuthScreen theme={theme} userRole={userRole} setUserRole={setUserRole} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} cardClass={cardClass} inputClass={inputClass} showToast={showToast} />
          ) : (
            <React.Fragment>
              {userRole === 'cidadao' && (
                <CidadaoDashboard 
                  screen={cidadaoScreen} 
                  setScreen={setCidadaoScreen} 
                  userPoints={userPoints} 
                  setUserPoints={setUserPoints}   // ADICIONADO: Dá acesso à alteração de pontos
                  cardClass={cardClass} 
                  inputClass={inputClass} 
                  selectedContainer={selectedContainer} 
                  setSelectedContainer={setSelectedContainer} 
                  runPhotoValidationTimer={runPhotoValidationTimer} 
                  triggerVoucherRedemptionFlow={triggerVoucherRedemptionFlow} 
                  activeWalletTab={activeWalletTab} 
                  setActiveWalletTab={setActiveWalletTab} 
                  myCoupons={myCoupons}
                  setMyCoupons={setMyCoupons}     // ADICIONADO: Modificador reativo para limpar cupons mockados
                  userId={userId}                 // ADICIONADO: Passa o ID correto do banco
                />
              )}
              {userRole === 'empresa' && (
                <EmpresaDashboard screen={empresaScreen} setScreen={setEmpresaScreen} sidebarClass={sidebarClass} cardClass={cardClass} inputClass={inputClass} globalLimits={globalLimits} showToast={showToast} />
              )}
              {userRole === 'admin' && (
                <AdminDashboard screen={adminScreen} setScreen={setAdminScreen} sidebarClass={sidebarClass} cardClass={cardClass} inputClass={inputClass} globalLimits={globalLimits} setGlobalLimits={setGlobalLimits} showToast={showToast} />
              )}
            </React.Fragment>
          )}
        </div>
      </div>

      {showVoucherModal && pendingVoucher && (
        <VoucherModal pendingVoucher={pendingVoucher} setShowVoucherModal={setShowVoucherModal} confirmVoucherRedemption={confirmVoucherRedemption} cardClass={cardClass} />
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 z-[2000] view-transition flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border min-w-[280px] transition-colors duration-300 ${ theme === 'dark' ? 'bg-[#151923] border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900' }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${ toast.type === 'success' ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border border-emerald-200') : toast.type === 'error' ? (theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-100 text-red-600 border border-red-200') : (theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600 border border-blue-200') }`}>
            <i className={`fa-solid ${ toast.type === 'success' ? 'fa-circle-check' : toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info' }`}></i>
          </div>
          <div className="flex-1 text-xs font-semibold leading-snug"> {toast.message} </div>
        </div>
      )}
    </div>
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<EcoCircuitApp />);