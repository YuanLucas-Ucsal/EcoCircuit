from datetime import datetime, timedelta
from db import db

class Voucher(db.Model):
    __tablename__ = 'vouchers'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('cidadao.id'), nullable=False)
    oferta_id = db.Column(db.Integer, db.ForeignKey('ofertas.id'), nullable=False)
    pontos_utilizados = db.Column(db.Integer, nullable=False)
    codigo = db.Column(db.String(50), nullable=False, unique=True)
    data_expiracao = db.Column(db.String(20), nullable=False)
    
    cidadao = db.relationship("Cidadao", backref=db.backref("vouchers_resgatados", lazy=True))
    oferta = db.relationship("Oferta")