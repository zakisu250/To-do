from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Zaki:postgres@localhost/todo-list'
db = SQLAlchemy(app)
CORS(app)


class Todo(db.Model):
    __tablename__ = 'todo-list'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Todo: {self.description}"

    def __init__(self, description):
        self.description = description

# formatted output


def format_todo(item):
    return {
        "description": item.description,
        "id": item.id,
        "createdAt": item.createdAt
    }


@app.route('/')
def hello():
    return "Hey!"

# create todos


@app.route('/todos', methods=['POST'])
def create_todos():
    description = request.json['description']
    todos = Todo(description)
    db.session.add(todos)
    db.session.commit()
    return format_todo(todos)

# get individual todo


@app.route('/todos/<id>', methods=['GET'])
def retrieve_todo(id):
    todo = Todo.query.filter_by(id=id).one()
    formatted_todo = format_todo(todo)
    return jsonify(formatted_todo)

# delete individual todo


@app.route('/todos/<id>', methods=['DELETE'])
def del_todo(id):
    todo = Todo.query.filter_by(id=id).one()
    db.session.delete(todo)
    db.session.commit()
    return f"Todo 'id = {id}' Deleted!"

# update or edit todos


@app.route('/todos/<id>', methods=['PUT'])
def edit_todo(id):
    todo = Todo.query.filter_by(id=id)
    description = request.json['description']
    todo.update(dict(description=description, createdAt=datetime.utcnow()))
    db.session.commit()
    return {'Todo': format_todo(todo.one())}

# get all todos


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.order_by(Todo.createdAt.asc()).all()
    todo_list = []
    for todo in todos:
        todo_list.append(format_todo(todo))
    return jsonify(todo_list)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run()
