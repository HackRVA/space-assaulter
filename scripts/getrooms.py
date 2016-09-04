#!/usr/bin/python2

import sys
import MySQLdb
import json

# Read from the rooms table
def main():
  try:
    print("Content-type: application/json")
    print("")
    # Open the database
    db = MySQLdb.connect(host = "localhost",
                         user = "hackrva_games",
                         db = "hackrva_games",
                         passwd = "")
    cur = db.cursor()
    # Retrieve the rooms
    cur.execute("""SELECT rooms.id, rooms.name, count(offers.id) 
      FROM rooms 
      LEFT JOIN offers 
        ON rooms.id = offers.id 
      GROUP BY rooms.id;""")
    # Provide a JSON array of the rooms
    print(json.dumps([{"id": roomid, "name": name, "count": count} for (roomid, name, count) in cur]))
    cur.close()
    db.close()
  except:
    print("A failure occurred ...")
    print(sys.exc_info())

main()

