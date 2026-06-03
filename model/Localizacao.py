from db import db
from flask_login import UserMixin
import random

class Localizacao(db.Model):
    __tablename__ = 'localizacao'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(150), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    cadastradoPor = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=True)
    suporte_maximo = db.Column(db.Integer, nullable=False, default=1000)
    historico_massa = db.relationship('RegistroMassa', backref='local', lazy=True)

    def getId(self): return self.id
    def getNome(self): return self.nome
    def getLatitude(self): return self.latitude
    def getLongitude(self): return self.longitude
    def getCadastradoPor(self): return self.cadastradoPor
    def getSuporteMaximo(self): return self.suporte_maximo
    def to_dict(self):
        ocupacao_simulada = 100 if self.id % 2 == 0 else random.randint(30, 85)
        status_simulado = "PORTA BLOQUEADA" if ocupacao_simulada >= 100 else "Operação Estável"

        return {
            "id": self.id,
            "nome": self.nome,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "cadastradoPor": self.cadastradoPor,
            "ocupacao": ocupacao_simulada,
            "status_operacional": status_simulado
        }
    
class RegistroMassa(db.Model):
    __tablename__ = 'registro_massa'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    localizacao_id = db.Column(db.Integer, db.ForeignKey('localizacao.id'), nullable=False)
    massa_kg = db.Column(db.Float, nullable=False, default=0.0)
    data_registro = db.Column(db.DateTime, default=db.func.current_timestamp())