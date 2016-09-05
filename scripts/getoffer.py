#!/usr/bin/python2

import cgi
import sys
import MySQLdb
import json
from wrap import wrap_db

def db_ops(cur, sock):
  # Use the roomid value to find offers
  roomid = int(form.getvalue("id"))
  cur.execute("""SELECT id, contents
    FROM offers WHERE room_id=%s LIMIT 1;""", (roomid, ))
  json.dump([{
    "id": offerid, 
    "contents": contents}
      for (offerid, contents) in cur], sock)

def get_req(sock):
  form = cgi.FieldStorage()
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({'GET': get_req})

main()

