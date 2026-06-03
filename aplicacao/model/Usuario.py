from db import db
from flask_login import UserMixin

class Usuario(db.Model, UserMixin):
    __abstract__ = True  

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False) 
    senha = db.Column(db.String(256), nullable=False)

    def get_id(self):
        # Descobre dinamicamente o nome da tabela (ex: 'empresa', 'admin', 'cidadao')
        tipo = self.__tablename__
        return f"{tipo}_{self.id}"

    def getId(self): return self.id
    def getNome(self): return self.nome
    def setNome(self, nome): self.nome = nome
    def getSenha(self): return self.senha
    def setSenha(self, senha): self.senha = senha