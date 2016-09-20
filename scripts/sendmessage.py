#!/usr/bin/python2

import cgi
import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock, sockin):
  form = cgi.FieldStorage()
  data = json.load(sockin)
  cur.execute(
    "INSERT INTO messages (sender, recipient, message) VALUES (%s, %s, %s);",
    data["sender"],
    data["recipient"],
    data["message"])
  json.dump(
    { "id": cur.lastrowid },
    sock)

def get_req(sock):
  wrap_db(db_ops, sock, sockin)

def main():
  wrap_cgi({"GET": get_req}, sys.stdout, sys.stdin)

main()

