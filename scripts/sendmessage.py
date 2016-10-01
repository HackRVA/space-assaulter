#!/usr/bin/python2

import json
from sys import stdin, stdout
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock, sockin):
  data = json.load(sockin)
  cur.execute(
    "INSERT INTO messages (sender, recipient, message) VALUES (%s, %s, %s);",
    (data["sender"],
    data["recipient"],
    json.dumps(data["message"])))
  json.dump(
    { "id": cur.lastrowid },
    sock)

def post_req(sock, sockin):
  wrap_db(db_ops, sock, sockin)

def main():
  wrap_cgi({"POST": post_req}, stdout, stdin)

main()

