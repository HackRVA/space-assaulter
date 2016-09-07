#!/usr/bin/python2

import sys
import MySQLdb
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock, sockin):
  answerdata = json.load(sockin)
  cur.execute(
    "INSERT INTO answers (room_id, offer_id, sdp_type, sdp) VALUES (%s, %s, %s, %s);", 
    ( answerdata['room'], 
      answerdata['offer'],
      answerdata['answer']['type'], 
      answerdata['answer']['sdp']))
  json.dump({"id": cur.lastrowid}, sock)

def post_req(sock, sockin):
  wrap_db(db_ops, sock, sockin)

def main():
  wrap_cgi({'POST': post_req}, sys.stdout, sys.stdin)

main()

