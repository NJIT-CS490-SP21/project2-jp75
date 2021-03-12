from app import DB


class Person(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username

class Joined(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, unique=False, nullable=True)

    def __repr__(self):
        return '<Joined %r>' % self.username
