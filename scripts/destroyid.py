#!/usr/bin/python2

import sys
import cgi
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage();
  cur.execute("DELETE FROM users WHERE id=%s;", form.get("id"))
  json.dump({"dropped": cur.rowcount }, sock)

def cgi_ops(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": cgi_ops}, sys.stdout)

main()

