from flask import Blueprint, request, jsonify
from models.group import Group
from models.user import User
from db import db
import uuid
group_bp = Blueprint('group', __name__)

@group_bp.route('/create_group', methods=['POST'])
def create_group():
    data = request.get_json()
    group_name = data.get('group_name')

    if not group_name:
        return jsonify({'error': 'Group name is required'}), 400
    existing_group = Group.query.filter_by(name=group_name).first()
    if existing_group:
        return jsonify({'error': 'Group with this name already exists'}), 400

    new_group = Group(group_uuid=str(uuid.uuid4()), name=group_name)
    db.session.add(new_group)
    db.session.commit()

    return jsonify({'message': 'Group created successfully', 'group_uuid': new_group.group_uuid}), 201

@group_bp.route('/add_user_to_group/<string:group_uuid>/<string:user_uuid>', methods=['POST'])
def add_user_to_group(group_uuid, user_uuid):
    group = Group.query.filter_by(group_uuid=group_uuid).first()
    user = User.query.filter_by(user_uuid=user_uuid).first()

    if not group:
        return jsonify({'error': 'Group not found'}), 404

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if group in user.group:
        return jsonify({'error': 'User is already a member of the group'}), 400
    if user.group:
        return jsonify({'error': 'User is already a member of a group. Remove the user from the current group first.'}), 400

    user.add_to_group(group)
    db.session.commit()

    return jsonify({'message': 'User added to group successfully'}), 200
    
@group_bp.route('/get_group/<string:group_uuid>', methods=['GET'])
def get_group(group_uuid):
    group = Group.query.filter_by(group_uuid=group_uuid).first()

    if group:
        return jsonify(group.to_dict()), 200
    else:
        return jsonify({'error': 'Group not found'}), 404

@group_bp.route('/get_all_groups', methods=['GET'])
def get_all_groups():
    groups = Group.query.all()
    groups_data = [group.to_dict() for group in groups]
    return jsonify(groups_data), 200

@group_bp.route('/change_member_role/<string:group_id>/<string:user_id>/<string:new_role>', methods=['POST'])
def change_member_role(group_id, user_id, new_role):
    group = Group.query.filter_by(id=group_id).first()

    if group:
        group.change_member_role(user_id, new_role)
        group.save()
        return jsonify({'message': 'Member role changed successfully', 'new_role': new_role}), 200
    else:
        return jsonify({'error': 'Group not found'}), 404


@group_bp.route('/delete_group/<string:group_id>', methods=['DELETE'])
def delete_group(group_id):
    group = Group.query.get(group_id)

    if group:
        group.remove_group()
        return jsonify({'message': 'Group deleted successfully'}), 200
    else:
        return jsonify({'error': 'Group not found'}), 404