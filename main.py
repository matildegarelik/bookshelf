from flask import Flask, render_template, redirect, url_for, request, session, flash
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship


app = Flask(__name__)
app.secret_key = "12345678" 
app.permanent_session_lifetime = timedelta(minutes=5) 

app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///books.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False

db = SQLAlchemy(app)

class Usuarios(db.Model):
    _id =  db.Column("id", db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name= db.Column(db.String(100))
    username = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    estantes = relationship("Estantes")

    def __init__(self, first_name, last_name, username, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.password = password 

class Libros (db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    gb_id= db.Column(db.String(100))
    isbn= db.Column(db.String(100))
    estantes = relationship("Estantes")
    
    def __init__(self, gb_id, isbn, user_id):
        self.gb_id = gb_id
        self.isbn = isbn

class Estantes (db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    user_id= db.Column(db.Integer, db.ForeignKey('Usuarios.id'))
    book_id= db.Column(db.Integer, db.ForeignKey('Libros.id'))
    estado= db.Column(db.String(100))
    categoria= db.Column(db.String(100))

    def __init__(self, user_id, book_id, estado, categoria):   
        self.user_id = user_id
        self.book_id = book_id
        self.estado = estado
        self.categoria = categoria

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/search')
def search():
    return render_template("search.html")

@app.route('/book')
def book():
    return render_template("book.html")

@app.route('/user')
def user():
    return render_template("user.html")

@app.route('/bookshelf')
def bookshelf():
    return render_template("bookshelf.html")

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        session.permanent = True
        username = request.form["nm"]
        password = request.form["pw"]
        session["user"] = username

        found_user= Usuarios.query.filter_by(username=username).first()
        
        if found_user:
            if found_user.password == password:
                flash('Login successfull!')
                return redirect(url_for("user"))
            else:
                flash('Incorrect password')
                return redirect(url_for("login"))
        else:
            flash('User not found')
            return redirect(url_for("login"))
    
    else:
        if "user" in session:
            flash('Already logged in')
            return redirect(url_for("user"))
        return render_template('login.html')

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == "POST":
        session.permanent = True
        first_name = request.form["first_nm"]
        last_name = request.form["last_nm"]
        email = request.form["email"]
        username = request.form["nm"]
        password = request.form["pw"]

        if not Usuarios.query.filter_by(username=username):
            new_user= Usuarios(first_name, last_name, username, email, password)
            db.session.add(new_user)
            db.session.commit()
            session["user"] = username
            return redirect(url_for("user"))
        else:
            flash("Username unavaiable")
            return redirect(url_for("signup"))
    else:
        return render_template("signup.html")


@app.route("/logout")
def logout():
    session.pop("user", None)
    flash("You have been logged out!", "info")
    return redirect(url_for("login")) 

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)