#!/usr/bin/python2

import cgi
import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage()
  user_id = form.getvalue("id")
  last_id = form.getvalue("from")
  cur.execute("""SELECT id, sender, message FROM messages WHERE 
     id>%s AND (recipient=%s OR recipient=1);""", (last_id, user_id))
  json.dump(
    [{
      "id": msg_id,
      "sender": sender,
      "message": "" if message == "" else json.loads(message)
     } for (msg_id, sender, message) in cur],
    sock)

def get_req(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": get_req}, sys.stdout)

main()

