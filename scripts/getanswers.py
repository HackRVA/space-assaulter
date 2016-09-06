#!/usr/bin/python2

import cgi
import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage()
  roomid = long(form.getvalue("id"))
  cur.execute(
    "SELECT offer_id, contents FROM answers WHERE room_id=%s AND used=FALSE;", 
    (roomid, ))
  json.dump(
    [{"id": offer_id, "contents": contents} for (offer_id, contents) in cur], 
    sock)
  cur.execute("UPDATE answers SET used=TRUE WHERE room_id=%s;", (roomid, ))

def get_req(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({'GET': get_req}, sys.stdout)

main()
