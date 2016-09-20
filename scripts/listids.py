#!/usr/bin/python2

import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  cur.execute("SELECT id, name FROM users;")
  json.dump([{ "id": user_id, "name": name } for (user_id, name) in cur], sock)

def get_ops(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": get_ops}, sys.stdout)

main()

