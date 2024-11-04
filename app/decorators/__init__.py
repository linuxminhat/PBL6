from functools import wraps

from flask import redirect, session, url_for

from app.models.enum.account_role import AccountRole


def login_required(role=AccountRole.USER):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('home.index'))

            user_role = session['user'].get('role')
            # Handle both a single role and a list of roles
            if isinstance(role, list):
                # If it's a list, check if the user's role is in the allowed roles
                if user_role not in [r.value for r in role]:
                    return redirect(url_for('home.index'))
            else:
                # If it's a single role, check if the user's role matches
                if user_role != role.value:
                    return redirect(url_for('home.index'))

            return f(*args, **kwargs)

        return decorated_function

    return decorator


def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance
