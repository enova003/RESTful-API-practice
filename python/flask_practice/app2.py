from flask import Flask, jsonify, request

app = Flask(__name__)

usernames = {
    '0001': 'JJ',
    '0002': 'Kie'
}

@app.route('/')
def index():
    return 'Landing page for flask app'

@app.route('/user/get/<user_id>', methods=['GET'])
def get_user(user_id):
    if user_id in usernames:
        return jsonify({'user id': user_id, 'username': usernames[user_id]}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/user/post', methods=['POST'])
def create_user():
    data = request.get_json()
    user_id = data.get('user_id')
    username = data.get('username')

    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    if user_id in usernames:
        return jsonify({'error': 'User already exists'}), 400

    if not username:
        return jsonify({'error': 'username is required'}), 400
    
    usernames[user_id] = username

    return jsonify({'message': 'User created', 'user_id': user_id, 'username': usernames[user_id] }), 201

@app.route('/user/put/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    username = data.get('username')

    if user_id not in usernames:
        return jsonify({'error': 'User not found'}), 404

    if not username:
        return jsonify({'error': 'username is required'}), 400

    usernames[user_id] = username

    return jsonify({'message': 'User updated', 'user_id': user_id, 'username': usernames[user_id] }), 200

@app.route('/user/delete/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_id not in usernames:
        return jsonify({'error': 'User not found'}), 404

    del usernames[user_id]

    return jsonify({'message': 'User deleted', 'user_id': user_id}), 200

if __name__ == '__main__':
    app.run(debug=True)