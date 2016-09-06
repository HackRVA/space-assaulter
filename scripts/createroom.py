#!/usr/bin/python2

import sys
import MySQLdb
import json
from os import environ
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sockout, sockin):
  name = ""
  offers = []
  try:
    roomdata = json.load(sockin)
    name = roomdata["name"]
    offers = roomdata["offers"]
  except:
    json.dump({"error": "Failure parsing received data"}, sockout)
  cur.execute("INSERT INTO rooms (name) VALUES (%s);", (name, ))
  room_id = cur.lastrowid
  args = []
  for offer in offers:
    args.append(room_id)
    args.append(offer)
  offer_str = "INSERT INTO offers (room_id, contents) VALUES " + \
    ", ".join(["(%s, %s)" for i in range(0, len(offers))]) + ";"
  num_offers = cur.execute(offer_str, args)
  json.dump({
    "id": room_id,
    "num_offers": num_offers,
    "last_offer": cur.lastrowid
  }, sockout)

def post_req(sockout, sockin):
  wrap_db(db_ops, sockout, sockin)

# Create a new room with a set of offers
def main():
  wrap_cgi({'POST': post_req}, sys.stdout, sys.stdin)

main()

