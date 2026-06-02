function AuthScreen({ theme, userRole, setUserRole, setIsAuthenticated, cardClass, inputClass, showToast }) {
    const [authMode, setAuthMode] = React.useState('login'); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Captura todos os campos do formulário automaticamente usando os atributos 'name'
        const formulario = new FormData(e.target);
        const dadosDigitados = Object.fromEntries(formulario);

        // Define a URL com base no modo (Login, Cadastro ou Recuperação)
        let url = 'http://localhost:8000/api/auth/login';
        if (authMode === 'register') url = 'http://localhost:8000/api/auth/cadastro';
        if (authMode === 'forgot') url = 'http://localhost:8000/api/auth/recuperar-senha';

        // Envia os dados para o servidor Python de forma assíncrona
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...dadosDigitados,
                role: userRole // Envia também o perfil selecionado (cidadão, empresa ou admin)
            })
        })
        .then(resposta => {
            if (resposta.ok) {
                if (authMode === 'login') {
                    setIsAuthenticated(true);
                    showToast('Login efetuado com sucesso!', 'success');
                } else if (authMode === 'register') {
                    if (userRole === 'empresa') {
                        showToast('Cadastro submetido! Aguardando aprovação da Codexa.', 'success');
                    } else {
                        showToast('Cadastro realizado! Faça seu login.', 'success');
                    }
                    setAuthMode('login');
                } else if (authMode === 'forgot') {
                    showToast('Instruções de recuperação enviadas para o e-mail!', 'success');
                    setAuthMode('login');
                }
            } else {
                showToast('Ocorreu um erro na requisição com o servidor.', 'error');
            }
        })
        .catch(erro => {
            console.error("Erro na conexão HTTP:", erro);
            showToast('Erro de conexão. O servidor Python está rodando?', 'error');
        });
    };

    const getLeftPanelTitle = () => {
        if (authMode === 'login') return 'Faça o Login em nossa Plataforma';
        if (authMode === 'register') return 'Cadastre-se agora em nossa Plataforma';
        return 'Recupere o seu Acesso';
    };

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-full flex-1 view-transition">
            <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-[#11141c] border-zinc-800' : 'bg-white border-slate-200'}`}>
                
                {/* Painel Esquerdo */}
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white flex flex-col justify-between overflow-hidden min-h-[380px]">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-44 h-44 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute top-[-5%] right-[-5%] w-36 h-36 rounded-3xl bg-emerald-400/20 rotate-12 blur-md"></div>
                    
                    <div className="flex items-center gap-2 font-bold text-base relative z-10">
                        <i className="fa-solid fa-leaf text-white text-lg"></i>
                        <span>EcoCircuit</span>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                        <h2 className="text-3xl font-black tracking-tight leading-tight view-transition">
                            {getLeftPanelTitle()}
                        </h2>
                        <p className="text-xs text-emerald-100/80 leading-relaxed">
                            Conectando cidadãos a locais estratégicos de coleta de materiais eletrônicos de forma ágil, segura e gamificada.
                        </p>
                    </div>
                    <p className="text-[10px] text-emerald-200/50 relative z-10">Smart Code Solutions &copy; 2026</p>
                </div>

                {/* Painel Direito */}
                <div className="p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-extrabold tracking-tight view-transition">
                            {authMode === 'login' && 'Portal de Acesso Integrado'}
                            {authMode === 'register' && 'Crie sua Conta Virtual'}
                            {authMode === 'forgot' && 'Recuperação de Credenciais'}
                        </h3>
                        <p className="text-xs text-gray-400">
                            {authMode === 'forgot' 
                                ? 'Insira o endereço eletrônico registrado para receber o token de redefinição de senha.' 
                                : 'Selecione seu escopo profissional abaixo para carregar os campos correspondentes de forma dinâmica.'}
                        </p>
                    </div>

                    {authMode !== 'forgot' ? (
                        <div className="grid grid-cols-3 gap-1 bg-zinc-500/10 p-1 rounded-xl border border-zinc-700/5 view-transition">
                            <button type="button" onClick={() => setUserRole('cidadao')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'cidadao' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400'}`}>Cidadão</button>
                            <button type="button" onClick={() => setUserRole('empresa')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'empresa' ? 'bg-blue-500 text-white shadow' : 'text-gray-400'}`}>Empresa</button>
                            <button type="button" onClick={() => setUserRole('admin')} className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${userRole === 'admin' ? 'bg-purple-500 text-white shadow' : 'text-gray-400'}`}>Admin</button>
                        </div>
                    ) : (
                        <div className="text-xs text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl w-fit view-transition uppercase tracking-wider text-[10px]">
                            <i className="fa-solid fa-user-shield mr-1.5"></i> Perfil: {userRole}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        
                        {/* ADICIONADO: name="nome" */}
                        {authMode === 'register' && (
                            <div className="space-y-1 view-transition">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {userRole === 'empresa' ? 'Nome da Empresa' : userRole === 'admin' ? 'Identificação do Administrador' : 'Nome Completo'}
                                </label>
                                <div className="relative">
                                    <input required type="text" name="nome" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder={userRole === 'empresa' ? 'Razão Social ou Nome Fantasia' : userRole === 'admin' ? 'Ex: Gestor de Operações Codexa' : 'Seu nome completo'} />
                                    <i className={`fa-solid ${userRole === 'admin' ? 'fa-user-tie' : 'fa-user'} absolute left-3 top-3.5 text-gray-400 text-xs`}></i>
                                </div>
                            </div>
                        )}

                        {/* ADICIONADO: name="identificador" */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {userRole === 'empresa' && authMode !== 'forgot' ? 'CNPJ Corporativo' : userRole === 'admin' ? 'E-mail Corporativo (Codexa)' : 'Endereço de E-mail'}
                            </label>
                            <div className="relative">
                                <input required type={(userRole === 'empresa' && authMode !== 'forgot') ? 'text' : 'email'} name="identificador" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder={(userRole === 'empresa' && authMode !== 'forgot') ? '00.000.000/0001-00' : userRole === 'admin' ? 'admin@codexa.com' : 'exemplo@diretriz.com'} />
                                <i className={`fa-solid ${(userRole === 'empresa' && authMode !== 'forgot') ? 'fa-id-card' : userRole === 'admin' ? 'fa-user-gear' : 'fa-envelope'} absolute left-3 top-3.5 text-gray-400 text-xs`}></i>
                            </div>
                        </div>

                        {/* ADICIONADO: name="endereco" */}
                        {authMode === 'register' && userRole !== 'admin' && (
                            <div className="space-y-1 view-transition">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Endereço Residencial / Operacional</label>
                                <div className="relative">
                                    <input required type="text" name="endereco" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="Rua, Número, Bairro e Cidade" />
                                    <i className="fa-solid fa-map-marker-alt absolute left-3 top-3.5 text-gray-400 text-xs"></i>
                                </div>
                            </div>
                        )}

                        {/* ADICIONADO: name="chave_mestre" */}
                        {authMode === 'register' && userRole === 'admin' && (
                            <div className="space-y-1 view-transition">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Chave Mestre de Segurança (Token Codexa)</label>
                                <div className="relative">
                                    <input required type="password" name="chave_mestre" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="••••••••••••" />
                                    <i className="fa-solid fa-key absolute left-3 top-3.5 text-gray-400 text-xs"></i>
                                </div>
                            </div>
                        )}

                        {/* ADICIONADO: name="senha" */}
                        {authMode !== 'forgot' && (
                            <div className="space-y-1 view-transition">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Senha de Acesso</label>
                                    {authMode === 'login' && (
                                        <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] text-emerald-500 font-semibold hover:underline bg-transparent border-none cursor-pointer">
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input required type="password" name="senha" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="••••••••" />
                                    <i className="fa-solid fa-lock absolute left-3 top-3.5 text-gray-400 text-xs"></i>
                                </div>
                            </div>
                        )}

                        {/* ADICIONADO: name="confirmar_senha" */}
                        {authMode === 'register' && (
                            <div className="space-y-1 view-transition">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirme sua Senha</label>
                                <div className="relative">
                                    <input required type="password" name="confirmar_senha" className={`w-full p-3 pl-9 text-xs rounded-xl border outline-none ${inputClass}`} placeholder="••••••••" />
                                    <i className="fa-solid fa-shield-halved absolute left-3 top-3.5 text-gray-400 text-xs"></i>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full p-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                            {authMode === 'login' && 'Entrar na SPA'}
                            {authMode === 'register' && 'Finalizar Meu Cadastro'}
                            {authMode === 'forgot' && 'Disparar Token de Recuperação'}
                        </button>
                    </form>

                    {/* Alternadores de Modo */}
                    <div className="text-center pt-2 border-t border-zinc-500/10">
                        {authMode === 'login' && (
                            <p className="text-xs text-gray-400 view-transition">
                                Não possui uma credencial ativa?{' '}
                                <button type="button" onClick={() => setAuthMode('register')} className="text-emerald-500 font-bold hover:underline bg-transparent border-none cursor-pointer">Crie uma conta</button>
                            </p>
                        )}
                        {authMode === 'register' && (
                            <p className="text-xs text-gray-400 view-transition">
                                Já possui cadastro no ecossistema?{' '}
                                <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-500 font-bold hover:underline bg-transparent border-none cursor-pointer">Faça seu login</button>
                            </p>
                        )}
                        {authMode === 'forgot' && (
                            <p className="text-xs text-gray-400 view-transition">
                                Lembrou seus dados de acesso?{' '}
                                <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-500 font-bold hover:underline bg-transparent border-none cursor-pointer">Voltar para o Login</button>
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}