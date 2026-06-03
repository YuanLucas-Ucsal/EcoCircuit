from db import db

class Oferta(db.Model):
    __tablename__ = 'ofertas'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    pontos_necessarios = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="PENDENTE")  # PENDENTE, APROVADA, REJEITADA
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    
    empresa = db.relationship("Empresa", backref=db.backref("ofertas", lazy=True))

    def __init__(self, titulo, pontos_necessarios, empresa_id, status="PENDENTE"):
        self.titulo = titulo
        self.pontos_necessarios = pontos_necessarios
        self.empresa_id = empresa_id
        self.status = status