from db import db
from flask_login import UserMixin
from model.Usuario import Usuario

class Cidadao(Usuario):
    __tablename__ = 'cidadao'

    endereco = db.Column(db.String(200), nullable=True)
    pontuacao = db.Column(db.Integer, nullable=False)

    def __init__(self, email, senha, nome, endereco, pontuacao):
        self.email = email
        self.senha = senha
        self.nome = nome
        self.endereco = endereco
        self.pontuacao = pontuacao