# from flask import Blueprint, render_template, request, redirect, url_for, flash, session
# from app.decorators import login_required
# from app.models import ExtendedAccount
#
# user_setting_bp = Blueprint('setting', __name__)
#
# @user_setting_bp.route('/settings', methods=['GET', 'POST'])
# @login_required()
# def settings():
#     # Lấy user_id từ session hoặc current_user
#     user = ExtendedAccount.objects(id=session['user']['id']).first()
#     if request.method == 'POST':
#         username = request.form.get('username')
#         email = request.form.get('email')
#         public_profile = request.form.get('public_profile') == 'on'
#
#         # Cập nhật thông tin người dùng
#         user.username = username
#         user.email = email
#         user.public_profile = public_profile
#         user.save()
#
#         flash('Cài đặt đã được cập nhật thành công!', 'success')
#         return redirect(url_for('user.settings'))
#
#     return render_template('user/setting/setting.html', user=user)
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.decorators import login_required
from app.models import ExtendedAccount

user_setting_bp = Blueprint('setting', __name__)

@user_setting_bp.route('/settings', methods=['GET', 'POST'])
@login_required()
def settings():
    # Lấy user_id từ session hoặc current_user
    user_id = session['user']['id']
    user = ExtendedAccount.objects(id=user_id).first()
    user = ExtendedAccount.objects(id=session['user']['id']).first()
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        public_profile = request.form.get('public_profile') == 'on'

        # Cập nhật thông tin người dùng
        user.username = username
        user.email = email
        user.public_profile = public_profile
        user.save()

        # Cập nhật session
        session['user']['username'] = user.username
        session['user']['email'] = user.email
        session['user']['public_profile'] = user.public_profile

        flash('Cài đặt đã được cập nhật thành công!', 'success')
        return redirect(url_for('setting.settings'))

    return render_template('user/setting/setting.html', user=user)
