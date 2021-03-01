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

class User(db.Model):
    _id =  db.Column("id", db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name= db.Column(db.String(100))
    username = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    books = db.relationship("Book", backref='user')

    def __init__(self, first_name, last_name, username, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.password = password 


class Book(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    gb_id= db.Column(db.String(100)) #Google Books ID
    ii_type= db.Column(db.String(100)) #Industry identifier type
    ii_value= db.Column(db.String(100)) #Industry identifier value
    state = db.Column(db.String(100))
    category = db.Column(db.String(100))
    user_id = db.Column (db.Integer, db.ForeignKey('user.id')) #Busca tabla en la base de datos, no clase de python, por eso es minuscula
    
    def __init__(self, gb_id, ii_type, ii_value, state, category, user_id):
        self.gb_id = gb_id
        self.ii_type = ii_type
        self.ii_value = ii_value
        self.state = state
        self.category = category
        self.user_id = user_id


@app.route('/')
def home():
    return render_template("index.html")

@app.route('/search')
def search():
    return render_template("search.html")

@app.route('/book', methods=['GET', 'POST'])
def book():
    user = User.query.filter_by(username=session["user"]).first()._id
    if request.method == "POST":
        new_book = Book(gb_id=request.form["gb_id"], 
            ii_type= request.form["iit"], 
            ii_value=request.form["iiv"], 
            state=request.form["state"], 
            category=request.form["category"], 
            user_id=user)
        db.session.add(new_book)
        db.session.commit()
        return render_template("book.html", my_books=Book.query.filter_by(user_id=user))
    return render_template("book.html", my_books=Book.query.filter_by(user_id=user))

@app.route('/user')
def user():
    return render_template("user.html", user=User.query.filter_by(username=session["user"]).first())

@app.route('/bookshelf')
def bookshelf():
    user = User.query.filter_by(username=session["user"]).first()._id
    return render_template("bookshelf.html", user=session["user"], user_books=Book.query.filter_by(user_id=user))

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        session.permanent = True
        username = request.form["nm"]
        password = request.form["pw"]
        session["user"] = username

        found_user= User.query.filter_by(username=username).first()
        
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

        #if not User.query.filter_by(username=username):
        new_user= User(first_name, last_name, username, email, password)
        db.session.add(new_user)
        db.session.commit()
        session["user"] = username
        return redirect(url_for("user"))
        #else:
        #    flash("Username unavaiable")
        #    return redirect(url_for("signup"))
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