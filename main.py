from flask import Flask, render_template, redirect, url_for, request, session, flash
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.secret_key = "12345678" 
app.permanent_session_lifetime = timedelta(minutes=5) 

#app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///users.sqlite3'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False

#db = SQLAlchemy(app)

#class usuarios(db.Model):
#    _id =  db.Column("id", db.Integer, primary_key=True)
#    name = db.Column(db.String(100))
#    email = db.Column(db.String(100))
#    password = db.Column(db.String(100))

#    def __init__(self, name, email, password):
#        self.name = name
#        self.email = email
#        self.password = password 

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/search')
def search():
    return render_template("search.html")

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        session.permanent = True
        user = request.form["nm"]
        session["user"] = user

        found_user= users.query.filter_by(name=user).first()

        if found_user:
            session["email"] = found_user.email
        else:
            usr =users(user, "")
            db.session.add(usr)
            db.session.commit()

        flash('Login successfull!')
        return redirect(url_for("user"))
    else:
        if "user" in session:
            flash('Already logged in')
            return redirect(url_for("user"))
        return render_template('login.html')

@app.route("/logout")
def logout():
    session.pop("user", None)
    session.pop("email", None)
    flash("You have been logged out!", "info")
    return redirect(url_for("login")) 

if __name__ == "__main__":
    #db.create_all()
    app.run(debug=True)