#!/usr/bin/python2

import sys
import MySQLdb
import json
from os import environ

# Create a new room with a set of offers
def main():
  try:
    print("Content-type: application/json")
    print("")
    # Needs to read from POST data
    roomdata = json.load(sys.stdin)
    name = roomdata["name"]
    offers = roomdata["offers"]
    # Open the database
    db = MySQLdb.connect(host = "localhost",
                         user = "hackrva_games",
                         db = "hackrva_games",
                         passwd = "")
    cur = db.cursor()
    cur.execute("INSERT INTO rooms (name) VALUES (%s);", (name, ))
    room_id = cur.lastrowid
    offer_str = """INSERT INTO offers (room_id, contents) 
      VALUES """ + ", ".join(["(%s, %s)" for i in range(0, num)]) + ";"
    args = []
    for offer in offers:
      args.append(room_id)
      args.append(offer)
    cur.execute(offer_str, (*args, ))
    cur.close()
    db.close()
  except:
    print("A failure occurred ...")
    print(sys.exc_info())

