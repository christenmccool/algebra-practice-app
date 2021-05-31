from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def show_home():
    return render_template('index.html')

@app.route('/graphinglines')
def show_graphs():
    return render_template('graphs.html')

@app.route('/equationsgraphs')
def show_equations():
    return render_template('equations-graphs.html')