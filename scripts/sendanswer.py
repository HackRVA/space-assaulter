#!/usr/bin/python2

import sys
import MySQLdb
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock, sockin):
  answerdata = json.load(sockin)
  cur.execute(
    "INSERT INTO answers (room_id, offer_id, contents) VALUES (%s, %s, %s);", 
    ( answerdata['room'], 
      answerdata['offer'], 
      answerdata['contents']))
  json.dump({"success": "Answer stored successfully"}, sock)

def post_req(sock, sockin):
  wrap_db(db_ops, sock, sockin)

def main():
  wrap_cgi({'POST': post_req}, sys.stdout, sys.stdin)

main()

