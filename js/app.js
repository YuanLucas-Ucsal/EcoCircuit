const { useState, useEffect } = React;

function EcoCircuitApp() {
    const [theme, setTheme] = useState('light');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('cidadao'); 
    const [cidadaoScreen, setCidadaoScreen] = useState('mapa');
    const [empresaScreen, setEmpresaScreen] = useState('status');
    const [adminScreen, setAdminScreen] = useState('bi');
    const [showDevPanel, setShowDevPanel] = useState(true);

    const [userPoints, setUserPoints] = useState(2750);
    const [globalLimits, setGlobalLimits] = useState({ min: 500, max: 5000 });
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [activeWalletTab, setActiveWalletTab] = useState('catalog');
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [pendingVoucher, setPendingVoucher] = useState(null);
    const [myCoupons, setMyCoupons] = useState([
        { id: 1, name: '10% OFF - Ferreira Costa (Geral)', code: 'EC-7721-XYZ', expiry: '30/06/2026' }
    ]);

    const [toast, setToast] = useState(null); 

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        document.body.className = theme === 'dark' 
            ? 'bg-[#0a0c10] text-gray-100' 
            : 'bg-[#f1f5f9] text-slate-900';
    }, [theme]);

    const injectAppState = (role, screenId) => {
        setUserRole(role);
        setIsAuthenticated(true);
        if (role === 'cidadao') setCidadaoScreen(screenId);
        if (role === 'empresa') setEmpresaScreen(screenId);
        if (role === 'admin') setAdminScreen(screenId);
        showToast(`Estado injetado: ${role} -> ${screenId}`, 'info');
    };

    const runPhotoValidationTimer = () => {
        setCidadaoScreen('loading');
        setTimeout(() => {
            setUserPoints(prev => prev + 350);
            setCidadaoScreen('success');
            showToast('Descarte processado com sucesso! +350 pontos na carteira.', 'success');
        }, 2200);
    };

    const triggerVoucherRedemptionFlow = (name, cost) => {
        if (userPoints < cost) {
            showToast('Margem de pontuação insuficiente para efetuar o resgate deste cupom.', 'error');
            return;
        }
        setPendingVoucher({ name, cost });
        setShowVoucherModal(true);
    };

    const confirmVoucherRedemption = () => {
        setUserPoints(prev => prev - pendingVoucher.cost);
        setMyCoupons(prev => [...prev, {
            id: Date.now(),
            name: pendingVoucher.name,
            code: `EC-${Math.floor(1000 + Math.random() * 9000)}-WEST`,
            expiry: '31/12/2026'
        }]);
        setShowVoucherModal(false);
        setPendingVoucher(null);
        setCidadaoScreen('carteira');
        setActiveWalletTab('my-coupons');
        showToast('Cupom resgatado com sucesso! Verifique sua carteira.', 'success');
    };

    const cardClass = theme === 'dark' 
        ? 'bg-[#151923] border-zinc-800 text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)]' 
        : 'bg-white border-slate-200 text-slate-900 shadow-[0_15px_35px_rgba(148,163,184,0.1)]';

    const inputClass = theme === 'dark'
        ? 'bg-[#1c212c] text-white border-zinc-700 focus:border-emerald-500'
        : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-emerald-500';

    const sidebarClass = theme === 'dark' ? 'bg-[#0f1218] border-r border-zinc-800/40' : 'bg-white border-r border-slate-200/80';

    return (
        <div className="min-h-screen flex flex-col relative z-10 flex-1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-8%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-400/5 blur-3xl"></div>
                <div className="absolute bottom-[-12%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-emerald-500/10 to-emerald-300/5 blur-3xl"></div>
            </div>

            <div className="sticky top-0 z-50 w-full flex flex-col">
                <Header 
                    theme={theme} 
                    setTheme={setTheme} 
                    showDevPanel={showDevPanel} 
                    setShowDevPanel={setShowDevPanel} 
                    setIsAuthenticated={setIsAuthenticated} 
                />
                {showDevPanel && <DevPanel injectAppState={injectAppState} />}
            </div>

            <div className="flex-1 flex flex-col relative z-10">
                <div className="flex-1 flex flex-col md:flex-row">
                    
                    {!isAuthenticated && (
                        <AuthScreen 
                            theme={theme} 
                            userRole={userRole} 
                            setUserRole={setUserRole} 
                            setIsAuthenticated={setIsAuthenticated} 
                            cardClass={cardClass} 
                            inputClass={inputClass} 
                            showToast={showToast}
                        />
                    )}

                    {isAuthenticated && userRole === 'cidadao' && (
                        <CidadaoDashboard 
                            screen={cidadaoScreen}
                            setScreen={setCidadaoScreen}
                            userPoints={userPoints}
                            cardClass={cardClass}
                            inputClass={inputClass}
                            selectedContainer={selectedContainer}
                            setSelectedContainer={setSelectedContainer}
                            runPhotoValidationTimer={runPhotoValidationTimer}
                            triggerVoucherRedemptionFlow={triggerVoucherRedemptionFlow}
                            activeWalletTab={activeWalletTab}
                            setActiveWalletTab={setActiveWalletTab}
                            myCoupons={myCoupons}
                        />
                    )}

                    {isAuthenticated && userRole === 'empresa' && (
                        <EmpresaDashboard 
                            screen={empresaScreen}
                            setScreen={setEmpresaScreen}
                            sidebarClass={sidebarClass}
                            cardClass={cardClass}
                            inputClass={inputClass}
                            globalLimits={globalLimits}
                            showToast={showToast}
                        />
                    )}

                    {isAuthenticated && userRole === 'admin' && (
                        <AdminDashboard 
                            screen={adminScreen}
                            setScreen={setAdminScreen}
                            sidebarClass={sidebarClass}
                            cardClass={cardClass}
                            inputClass={inputClass}
                            globalLimits={globalLimits}
                            setGlobalLimits={setGlobalLimits}
                            showToast={showToast}
                        />
                    )}

                </div>
            </div>

            {showVoucherModal && pendingVoucher && (
                <VoucherModal 
                    pendingVoucher={pendingVoucher}
                    setShowVoucherModal={setShowVoucherModal}
                    confirmVoucherRedemption={confirmVoucherRedemption}
                    cardClass={cardClass}
                />
            )}


            {toast && (
                <div className="fixed bottom-5 right-5 z-[2000] view-transition flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border bg-[#0f1217] border-zinc-800 text-white min-w-[280px]">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                        toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        toast.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                        <i className={`fa-solid ${
                            toast.type === 'success' ? 'fa-circle-check' :
                            toast.type === 'error' ? 'fa-circle-exclamation' :
                            'fa-circle-info'
                        }`}></i>
                    </div>
                    <div className="flex-1 text-xs font-semibold leading-snug">
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<EcoCircuitApp />);