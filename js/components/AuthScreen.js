function AuthScreen({ theme, userRole, setUserRole, setIsAuthenticated, cardClass, inputClass }) {
    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-full flex-1 view-transition">
            <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-[#11141c] border-zinc-800' : 'bg-white border-slate-200'}`}>
                
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white flex flex-col justify-between overflow-hidden min-h-[380px]">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-44 h-44 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute top-[-5%] right-[-5%] w-36 h-36 rounded-3xl bg-emerald-400/20 rotate-12 blur-md"></div>
                    
                    <div className="flex items-center gap-2 font-bold text-base relative z-10">
                        <i className="fa-solid fa-leaf text-white text-lg"></i>
                        <span>EcoCircuit</span>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                        <h2 className="text-3xl font-black tracking-tight leading-tight">Faça o Login em nossa Plataforma</h2>
                        <p className="text-xs text-emerald-100/80 leading-relaxed">Conectando cidadãos a locais estratégicos de coleta de materiais eletrônicos de forma ágil, segura e gamificada.</p>
                    </div>
                    <p className="text-[10px] text-emerald-200/50 relative z-10">Smart Code Solutions &copy; 2026</p>
                </div>

                <div className="p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-extrabold tracking-tight">Portal de Acesso Integrado</h3>
                        <p className="text-xs text-gray-400">Selecione seu escopo profissional abaixo para carregar os campos correspondentes.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 bg-zinc-500/10 p-1 rounded-xl border border-zinc-700/5">
                        <button type="button" onClick={() => setUserRole('cidadao')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'cidadao' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400'}`}>Cidadão</button>
                        <button type="button" onClick={() => setUserRole('empresa')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'empresa' ? 'bg-blue-500 text-white shadow' : 'text-gray-400'}`}>Empresa</button>
                        <button type="button" onClick={() => setUserRole('admin')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'admin' ? 'bg-purple-500 text-white shadow' : 'text-gray-400'}`}>Admin</button>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {userRole === 'empresa' ? 'CNPJ Corporativo' : 'Identificador / E-mail'}
                            </label>
                            <div className="relative">
                                <input type="text" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="Insira qualquer credencial para testar" />
                                <i className={`fa-solid ${userRole === 'empresa' ? 'fa-building' : 'fa-envelope'} absolute left-3 top-3.5 text-gray-400 text-xs`}></i>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Senha de Acesso</label>
                            <div className="relative">
                                <input type="password" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="••••••••" />
                                <i className="fa-solid fa-lock absolute left-3 top-3.5 text-gray-400 text-xs"></i>
                            </div>
                        </div>
                        <button type="submit" className="w-full p-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                            Entrar na SPA
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}