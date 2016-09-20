#!/usr/bin/python2

import sys
import cgi
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  form = cgi.FieldStorage();
  cur.execute("INSERT INTO users (name) VALUES (%s);", form.get("name"))
  json.dump({"id": cur.lastrowid}, sock)

def cgi_ops(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": cgi_ops}, sys.stdout)

main()

