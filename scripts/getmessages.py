!/usr/bin/python2

import cgi
import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage()
  user_id = form.get("id")
  cur.execute("SELECT id, sender, message FROM messages WHERE recipient=%s;", user_id)
  json.dump(
    [{
      "id": msg_id,
      "sender": sender,
      "message": message
     } for (msg_id, sender, message) in cur],
    sock)

def get_req(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": get_req}, sys.stdout)

main()

