import traceback
import sys

try:
    import app.main
    print('SUCCESS_MAIN_IMPORTED')
except Exception as e:
    with open('error.log', 'w') as f:
        f.write(traceback.format_exc())
    print('ERROR_CAUGHT')
