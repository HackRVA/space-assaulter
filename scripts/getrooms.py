#!/usr/bin/python2

import sys
import MySQLdb
import json

# Read from the rooms table
def main():
  try:
    sock = sys.stdout
    sock.write("Content-type: application/json\r\n\r\n")
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
    cur.close()
    db.close()
    # Provide a JSON array of the rooms
    json.dump(
      [{"id": roomid, "name": name, "count": count} 
        for (roomid, name, count) in cur],
      sock)
  except:
    print("A failure occurred ...")
    print(sys.exc_info())

main()

