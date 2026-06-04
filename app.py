from flask import render_template, Flask, request, session, redirect, url_for, current_app, flash, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix  # ✅ import aqui
from flask_cors import CORS
from db import db
import uuid
from model import Cidadao, Empresa, Admin, Localizacao, Oferta, RegistroMassa, Voucher
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)                                        # ✅ criado UMA vez
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)  # ✅ logo após
app.secret_key = os.environ.get("SECRET_KEY", os.urandom(24))

CORS(app)  

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///teste.db") 
if DATABASE_URL.startswith("postgres://"): 
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1) 

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = { "pool_pre_ping": True } 

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Permite cookies em requisições cross-site seguras
app.config['SESSION_COOKIE_SECURE'] = True    
app.config['SESSION_COOKIE_HTTPONLY'] = True   # Impede que scripts maliciosos acessem o cookie de sessão

migrate = Migrate(app, db) 
db.init_app(app) 

CHAVE_MESTRE_CODEXA = os.environ.get("CHAVE_MESTRE_CODEXA", "Codexa2026Secret") 

LIMITES_GLOBAIS = {"min": 500, "max": 5000}

# --- FLASK LOGIN CONFIG --- 
lm = LoginManager(app) 

@lm.user_loader 
def user_loader(id_com_tipo):
    if not id_com_tipo or "_" not in id_com_tipo:
        return None
    
    tipo, user_id = id_com_tipo.split("_", 1)
    user_id = int(user_id)
    
    if tipo == 'admin':
        return Admin.query.get(user_id)
    elif tipo == 'empresa':
        return Empresa.query.get(user_id)
    elif tipo == 'cidadao':
        return Cidadao.query.get(user_id)
    return None

@app.route('/') 
def inicial(): 
    return render_template('index.html')


@app.route('/api/auth/login', methods=['POST']) 
def api_login(): 
    dados = request.get_json() or {}
    identificador = dados.get('identificador')  
    senha = dados.get('senha') 
    role = dados.get('role')  

    if not identificador or not senha or not role:
        return jsonify({"status": "erro", "mensagem": "Todos os campos são obrigatórios."}), 400

    usuario = None

    if role == 'admin':
        usuario = Admin.query.filter_by(email=identificador).first()
    elif role == 'cidadao':
        usuario = Cidadao.query.filter_by(email=identificador).first()
    elif role == 'empresa':
        usuario = Empresa.query.filter_by(email=identificador).first()
        if not usuario:
            usuario = Empresa.query.filter_by(cnpj=identificador).first()

    if usuario and check_password_hash(usuario.senha, senha): 
        if role == 'empresa' and usuario.status == 'PENDENTE': 
            return jsonify({
                "status": "erro", 
                "mensagem": "Acesso negado. Sua conta corporativa ainda aguarda aprovação de um Administrador Codexa."
            }), 403 
        
        login_user(usuario, remember=True) 
        
        resposta = jsonify({ 
            "status": "sucesso", 
            "mensagem": f"Login efetuado com sucesso como {role.upper()}!", 
            "usuario": {
                "id": usuario.id, 
                "email": usuario.email, 
                "nome": usuario.nome,
                "role": role
            } 
        })
        return resposta, 200

    return jsonify({"status": "erro", "mensagem": "Credenciais de acesso incorretas ou inválidas."}), 401 


@app.route('/api/auth/cadastro', methods=['POST']) 
def api_cadastro(): 
    dados = request.get_json() or {}
    role = dados.get('role') 
    nome = dados.get('nome') 
    identificador = dados.get('identificador') 
    endereco = dados.get('endereco') 
    senha = dados.get('senha') 
    chave_mestre_enviada = dados.get('chave_mestre') 

    if not role or not nome or not identificador or not senha:
        return jsonify({"status": "erro", "mensagem": "Dados obrigatórios ausentes para o cadastro."}), 400

    if role == 'empresa':
        email_cadastro = f"contato@{nome.lower().replace(' ', '')}.com"
    else:
        email_cadastro = identificador

    # Validação de Duplicidade nas tabelas independentes
    if role == 'admin' and Admin.query.filter_by(email=email_cadastro).first():
        return jsonify({"status": "erro", "mensagem": "Este e-mail de Administrador já possui cadastro ativo."}), 400
    elif role == 'cidadao' and Cidadao.query.filter_by(email=email_cadastro).first():
        return jsonify({"status": "erro", "mensagem": "Este e-mail de Cidadão já possui cadastro ativo."}), 400
    elif role == 'empresa':
        if Empresa.query.filter_by(cnpj=identificador).first():
            return jsonify({"status": "erro", "mensagem": "Este CNPJ corporativo já possui cadastro ativo."}), 400
        if Empresa.query.filter_by(email=email_cadastro).first():
            return jsonify({"status": "erro", "mensagem": f"O e-mail gerado '{email_cadastro}' já está em uso."}), 400

    senha_hash = generate_password_hash(senha) 

    try:
        if role == 'admin':
            if chave_mestre_enviada != CHAVE_MESTRE_CODEXA:
                return jsonify({"status": "erro", "mensagem": "Token de segurança (Chave Mestre) incorreto."}), 403
            novo_usuario = Admin(email=email_cadastro, senha=senha_hash, nome=nome)
            mensagem_retorno = "Cadastro de Administrador Codexa realizado com sucesso!"
            
        elif role == 'empresa':
            novo_usuario = Empresa(
                email=email_cadastro, 
                senha=senha_hash, 
                nome=nome, 
                cnpj=identificador, 
                endereco=endereco, 
                status="PENDENTE"
            )
            mensagem_retorno = f"Cadastro corporativo submetido! Acesse futuramente com o e-mail gerado: {email_cadastro}"
            
        else:
            novo_usuario = Cidadao(email_cadastro, senha_hash, nome, endereco, 0)
            mensagem_retorno = "Cadastro de Cidadão realizado com sucesso! Você já pode realizar o seu login."

        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({"status": "sucesso", "mensagem": mensagem_retorno}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "erro", "mensagem": f"Erro interno ao salvar dados no banco de dados: {str(e)}"}), 500
    
@app.route('/api/auth/recuperar-senha', methods=['POST'])
def api_recuperar_senha():
    dados = request.get_json() or {}
    identificador = dados.get('identificador') 
    role = dados.get('role') 

    if not identificador or not role:
        return jsonify({"status": "erro", "mensagem": "O campo de e-mail e o perfil são obrigatórios."}), 400

    usuario = None

    if role == 'admin':
        usuario = Admin.query.filter_by(email=identificador).first()
    elif role == 'cidadao':
        usuario = Cidadao.query.filter_by(email=identificador).first()
    elif role == 'empresa':
        usuario = Empresa.query.filter_by(email=identificador).first()

    if not usuario:
        return jsonify({
            "status": "sucesso", 
            "mensagem": "Se este e-mail estiver cadastrado no perfil selecionado, as instruções de recuperação foram enviadas."
        }), 200

    try:
        app.logger.info(f"SOLICITAÇÃO DE RECUPERAÇÃO: Token enviado para {identificador} ({role.upper()})")

        return jsonify({
            "status": "sucesso",
            "mensagem": "Instruções de recuperação de senha enviadas para o seu e-mail corporativo ou pessoal!"
        }), 200

    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro interno ao processar recuperação: {str(e)}"}), 500

@app.route('/api/auth/logout', methods=['POST']) 
@login_required 
def api_logout(): 
    logout_user() 
    return jsonify({"status": "sucesso", "mensagem": "Sessão encerrada com sucesso."}), 200 

@app.route('/api/localizacoes', methods=['GET'])
def listar_localizacoes():
    try:
        pontos = Localizacao.query.all()
        resultado = []
        for ponto in pontos:
            volume_simulado = 45 if ponto.id % 2 == 0 else 100
            resultado.append({
                "id": ponto.id,
                "nome": ponto.nome,
                "latitude": ponto.latitude,
                "longitude": ponto.longitude,
                "volume": volume_simulado,
                "endereco": "Endereço cadastrado no sistema"
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao buscar pontos: {str(e)}"}), 500


@app.route('/api/ofertas', methods=['GET'])
def listar_ofertas():
    try:
        ofertas = Oferta.query.filter_by(status="APROVADA").all()
        resultado = []
        for o in ofertas:
            resultado.append({
                "id": o.id,
                "titulo": o.titulo,
                "pontos_necessarios": o.pontos_necessarios,
                "empresa": o.empresa.nome if o.empresa else "Parceiro"
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao buscar ofertas: {str(e)}"}), 500


@app.route('/api/cidadaos/<int:usuario_id>/vouchers', methods=['GET'])
def listar_vouchers_cidadao(usuario_id):
    try:
        vouchers = Voucher.query.filter_by(usuario_id=usuario_id).all()
        resultado = []
        for v in vouchers:
            titulo_real = v.oferta.titulo if v.oferta else "Oferta Descontinuada"
            resultado.append({
                "id": v.id,
                "name": titulo_real,      
                "code": v.codigo,          # Código alfanumérico curto HASH
                "expiry": v.data_expiracao # Data de validade
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao mapear carteira: {str(e)}"}), 500


@app.route('/api/cidadaos/<int:usuario_id>/perfil', methods=['GET'])
def buscar_perfil_cidadao(usuario_id):
    cidadao = db.session.get(Cidadao, usuario_id)
    if not cidadao:
        return jsonify({"erro": "Cidadão não encontrado"}), 404
    return jsonify({"pontuacao": cidadao.pontuacao}), 200


@app.route('/api/cidadaos/descarte-sucesso', methods=['POST'])
def registrar_descarte_sucesso():
    dados = request.json or {}
    usuario_id = dados.get('usuario_id')
    pontos_ganhos = dados.get('pontos', 350)
    print(pontos_ganhos)

    if not usuario_id:
        return jsonify({"sucesso": False, "erro": "Usuário não identificado."}), 400

    cidadao = db.session.get(Cidadao, int(usuario_id))
    if not cidadao:
        return jsonify({"sucesso": False, "erro": "Cidadão não encontrado."}), 404

    try:
        cidadao.pontuacao += pontos_ganhos
        print(cidadao.pontuacao)
        db.session.commit()

        return jsonify({
            "sucesso": True,
            "novo_saldo": cidadao.pontuacao
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"sucesso": False, "erro": f"Erro ao salvar no banco: {str(e)}"}), 500


@app.route('/api/vouchers/resgatar', methods=['POST'])
def resgatar_voucher():
    dados = request.json or {}
    oferta_id = dados.get('oferta_id')
    usuario_id = dados.get('usuario_id')
    
    if not usuario_id or not oferta_id:
        return jsonify({"sucesso": False, "erro": "Dados insuficientes para processar o resgate."}), 400

    oferta = db.session.get(Oferta, int(oferta_id))
    if not oferta:
        return jsonify({"sucesso": False, "erro": "A oferta selecionada não existe no catálogo."}), 404
        
    cidadao = db.session.get(Cidadao, int(usuario_id))
    if not cidadao:
        return jsonify({"sucesso": False, "erro": "Usuário comprador inválido."}), 404
        
    if cidadao.pontuacao < oferta.pontos_necessarios:
        return jsonify({"sucesso": False, "erro": "Margem de pontos insuficiente para esta transação."}), 400
        
    try:
        cidadao.pontuacao -= oferta.pontos_necessarios
        
        codigo_hash = str(uuid.uuid4()).upper()[:8]
        validade = (datetime.now() + timedelta(days=30)).strftime("%d/%m/%Y")
        
        novo_voucher = Voucher(
            usuario_id=cidadao.id,
            oferta_id=oferta.id,
            pontos_utilizados=oferta.pontos_necessarios,
            codigo=codigo_hash,
            data_expiracao=validade
        )
        
        db.session.add(novo_voucher)
        print(novo_voucher)
        db.session.commit()
        
        return jsonify({
            "sucesso": True,
            "novo_saldo": cidadao.pontuacao,
            "voucher": {
                "id": novo_voucher.id,
                "name": oferta.titulo,
                "code": codigo_hash,
                "expiry": validade
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"sucesso": False, "erro": f"Erro interno ao computar transação: {str(e)}"}), 500
    
@app.route('/api/admin/cidadaos', methods=['GET'])
def listar_cidadaos():
    try:
        cidadaos = Cidadao.query.all()
        
        resultado = []
        for c in cidadaos:
            resultado.append({
                "id": c.id,
                "nome": c.nome,
                "email": c.email 
            })
            
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao buscar cidadãos: {str(e)}"}), 500

@app.route('/api/admin/empresas', methods=['GET'])
def listar_empresas():
    try:
        empresas = Empresa.query.all()
        
        resultado = []
        for e in empresas:
            resultado.append({
                "id": e.id,
                "nome": e.nome,       
                "cnpj": e.cnpj,       
                "status": e.status    # PENDENTE, APROVADA ou REJEITADA
            })
            
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao listar empresas: {str(e)}"}), 500




@app.route('/api/admin/configuracao/limites', methods=['POST'])
def salvar_limites_globais():
    global LIMITES_GLOBAIS
    try:
        dados = request.get_json() or {}
        min_val = dados.get('min')
        max_val = dados.get('max')
        
        if min_val is None or max_val is None:
            return jsonify({"status": "erro", "mensagem": "Valores mínimos e máximos são obrigatórios."}), 400
            
        LIMITES_GLOBAIS['min'] = int(min_val)
        LIMITES_GLOBAIS['max'] = int(max_val)
        
        return jsonify({
            "status": "sucesso", 
            "mensagem": "Margens de pontuação globais salvas e atualizadas com sucesso!"
        }), 200
        
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro interno ao salvar limites: {str(e)}"}), 500


@app.route('/api/admin/empresas/<int:id_empresa>/status', methods=['PUT'])
def atualizar_status_empresa(id_empresa):
    try:
        dados = request.get_json() or {}
        novo_status = dados.get('status')
        
        if not novo_status:
            return jsonify({"status": "erro", "mensagem": "O novo status não foi informado."}), 400
            
        empresa = Empresa.query.get(id_empresa)
        
        if not empresa:
            return jsonify({"status": "erro", "mensagem": "Empresa parceira não encontrada na base de dados."}), 404
            
        # Altera o status (ex: 'APROVADO', 'REJEITADO', 'PENDENTE') e persiste no banco
        empresa.status = novo_status.upper()
        db.session.commit()
        
        return jsonify({
            "status": "sucesso", 
            "mensagem": f"Conta corporativa atualizada para o status: {novo_status.upper()}!"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "erro", "mensagem": f"Erro ao atualizar homologação do parceiro: {str(e)}"}), 500

@app.route('/api/admin/conteineres', methods=['GET'])
def obter_conteineres_iot():
    try:
        # Busca todas as localizações cadastradas no banco de dados
        locais = Localizacao.query.all()
        return jsonify([local.to_dict() for local in locais]), 200
    except Exception as e:
        print(f"Erro ao buscar localizações: {e}")
        return jsonify({"status": "erro", "mensagem": "Erro interno do servidor."}), 500

@app.route('/api/admin/bi/massa', methods=['GET'])
def obter_dados_bi_massa():
    try:
        locais = Localizacao.query.all()
        resposta = []
        
        for local in locais:
            ultimo_registro = RegistroMassa.query.filter_by(localizacao_id=local.id)\
                                                .order_by(RegistroMassa.data_registro.desc())\
                                                .first()
            
            massa_atual = ultimo_registro.massa_kg if ultimo_registro else 0.0
            
            resposta.append({
                "id": local.id,
                "nome_local": local.nome,
                "massa_atual": massa_atual,
                "suporte_maximo": local.suporte_maximo # Coluna dinâmica controlada pelo admin
            })
            
        return jsonify(resposta), 200
    except Exception as e:
        print(f"Erro no BI: {e}")
        return jsonify({"status": "erro", "mensagem": "Erro ao computar dados estatísticos."}), 500


@app.route('/api/ofertas/criar', methods=['POST'])
def api_criar_oferta_empresa():
    dados = request.json or {}
    titulo_oferta = dados.get('titulo_oferta')
    pontos_necessarios = dados.get('pontos_necessarios')
    empresa_id = dados.get('empresa_id', 1) 

    if not titulo_oferta or not pontos_necessarios:
        return jsonify({"status": "erro", "mensagem": "Dados da oferta estão incompletos."}), 400

    empresa = db.session.get(Empresa, int(empresa_id))
    if not empresa:
        return jsonify({"status": "erro", "mensagem": "Empresa criadora não encontrada."}), 404

    try:
        nova_oferta = Oferta(
            titulo=titulo_oferta,
            pontos_necessarios=int(pontos_necessarios),
            empresa_id=empresa.id,
            status="APROVADA"
        )

        db.session.add(nova_oferta)
        db.session.commit()

        return jsonify({
            "status": "sucesso", 
            "mensagem": "Campanha salva com sucesso!",
            "id": nova_oferta.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Erro detalhado do banco:", str(e))
        return jsonify({"status": "erro", "mensagem": f"Erro interno: {str(e)}"}), 500

@app.route('/api/empresas/<int:empresa_id>/vouchers', methods=['GET'])
def listar_vouchers_empresa(empresa_id):
    try:
        vouchers = Voucher.query.join(Oferta).filter(Oferta.empresa_id == empresa_id).all()
        
        resultado = []
        for v in vouchers:
            resultado.append({
                "id": v.id,
                "codigo": v.codigo,                                    
                "oferta_titulo": v.oferta.titulo if v.oferta else "Oferta Removida", 
                "utilizacao": v.data_expiracao,                       
                "status": "Consumido"                             
            })
            
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro ao buscar histórico da empresa: {str(e)}"}), 500

@app.route('/', defaults={'path': ''}) 
@app.route('/<path:path>') 
def catch_all(path): 
    return render_template('index.html') 

with app.app_context(): 
    db.create_all() 

if __name__ == '__main__': 
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
