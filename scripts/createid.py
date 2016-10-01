#!/usr/bin/python2

import sys
import cgi
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  # Peer insertion needs to be atomic with peer retrieval
  form = cgi.FieldStorage();
  cur.execute("INSERT INTO users () VALUES ();")
  newid = cur.lastrowid
  # Announce presence in an empty message
  cur.execute("INSERT INTO messages (message, sender, recipient) VALUES (\"\", %s, 1);", (newid, ))
  cur.execute("SELECT id FROM users;")
  json.dump({ "id": newid, "peers": [peerid for (peerid, ) in cur] }, sock)

def cgi_ops(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({"GET": cgi_ops}, sys.stdout)

main()

