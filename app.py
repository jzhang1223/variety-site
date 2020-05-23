from flask import Flask, render_template, url_for
app = Flask(__name__)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/tetris')
def tetris():
  return render_template('tetris.html')

@app.route('/dogVote')
def dogVote():
  return render_template('dogVote.html', template_folder='../')

if __name__ == '__main__':
  app.debug = True
  app.run()