#!/usr/bin/python2

import sys
import MySQLdb
import json
import cgi
from os import environ
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sockout, sockin):
  name = ""
  try:
    form = cgi.FieldStorage()
    name = form.getvalue("name")
  except:
    json.dump({"error": "Failure parsing received data"}, sockout)
  cur.execute("INSERT INTO rooms (name) VALUES (%s);", (name, ))
  room_id = cur.lastrowid
  json.dump({
    "id": room_id
  }, sockout)

def get_req(sockout, sockin):
  wrap_db(db_ops, sockout, sockin)

# Create a new room without any offers
def main():
  wrap_cgi({'GET': get_req}, sys.stdout, sys.stdin)

main()

