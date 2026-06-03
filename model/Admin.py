from db import db
from flask_login import UserMixin
from model.Usuario import Usuario

class Admin(Usuario):
    __tablename__ = 'admin'

    emailCorporativo = db.Column(db.String(120), unique=True, nullable=True)
    tokenCodexa = db.Column(db.String(100), nullable=True)

    def __init__(self, email, senha, nome, tokenCodexa=None):
        self.email = email             
        self.senha = senha             
        self.nome = nome               
        self.emailCorporativo = email 
        self.tokenCodexa = tokenCodexa

    def getEmailCorporativo(self): 
        return self.emailCorporativo 
        
    def setEmailCorporativo(self, email): 
        self.emailCorporativo = email 
        self.email = email  
        
    def getTokenCodexa(self): 
        return self.tokenCodexa
        
    def setTokenCodexa(self, token):
        self.tokenCodexa = token 