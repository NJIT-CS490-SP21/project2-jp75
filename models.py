from app import db

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username
        
class Joined(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    score =  db.Column(db.Integer, unique=False, nullable=True)

    def __repr__(self):
        return '<Joined %r>' % self.username