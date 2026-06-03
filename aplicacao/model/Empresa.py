from db import db
from flask_login import UserMixin
from model.Usuario import Usuario

class Empresa(Usuario):
    __tablename__ = 'empresa'

    cnpj = db.Column(db.String(20), unique=True, nullable=True)
    endereco = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(20), default="PENDENTE") 

    def __init__(self, email, senha, nome, cnpj, endereco, status="PENDENTE"):
        self.email = email
        self.senha = senha
        self.nome = nome
        self.cnpj = cnpj
        self.endereco = endereco
        self.status = status

    def getCnpj(self): return self.cnpj
    def setCnpj(self, cnpj): self.cnpj = cnpj
    def getEndereco(self): return self.endereco
    def setEndereco(self, endereco): self.endereco = endereco