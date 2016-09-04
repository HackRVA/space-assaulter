#!/usr/bin/python2

import cgi
import sys
import MySQLdb
import json

# Use the roomid value to find offers
def main():
  try:
    print("Content-type: application/json")
    print("")
    form = cgi.FieldStorage()
    roomid = int(form.getvalue("id"))
    db = MySQLdb.connect(host = "localhost",
                         user = "hackrva_games",
                         db = "hackrva_games",
                         passwd = "")
    cur = db.cursor()
    cur.execute("""SELECT id, contents
      FROM offers WHERE room_id=%s LIMIT 1;""", (roomid, ))
    print(json.dumps([{
      "id": offerid, 
      "contents": contents}
        for (offerid, contents) in cur]))
  except:
    print("A failure occurred ...")
    print(sys.exc_info())

main()

