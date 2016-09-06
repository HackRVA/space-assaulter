#!/usr/bin/python2

import sys
import MySQLdb
import json
import cgi
from os import environ
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage()
  roomid = long(form.getvalue("id"))
  cur.execute("DELETE FROM rooms WHERE id=%s;", roomid)
  json.dump({"message": "successfully closed room {0}".format(roomid)}, sock)

def get_req(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({'GET': get_req}, sys.stdout)

main()

