import MySQLdb
import json
from os import environ

def wrap_db(ops, sock, *extra):
  try:
    db = MySQLdb.connect(host = "localhost",
                         user = "hackrva_games",
                         db = "hackrva_games",
                         passwd = "")
    try:
      cur = db.cursor()
      ops(cur, sock, *extra)
      cur.close()
      return False
    except:
      json.dump({"error": "Failed during cursor operations"}, sock)
      return True
    finally:
      db.close()
  except:
    json.dump({"error": "Failed during database opening"}, sock)
    return True

def wrap_cgi(op_dict, sock, *extra):
  sock.write("Content-type: application/json\r\n\r\n")
  method = environ["REQUEST_METHOD"]
  if method in op_dict:
    op_dict[method](sock, *extra)
    return False
  else:
    json.dump({"error": "{0} requests not supported".format(method)}, sock)
    return True

