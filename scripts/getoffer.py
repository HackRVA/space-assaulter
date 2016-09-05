#!/usr/bin/python2

import cgi
import sys
import MySQLdb
import json

# Use the roomid value to find offers
def main():
  try:
    sock = sys.stdout
    sock.write("Content-type: application/json\r\n\r\n")
    form = cgi.FieldStorage()
    roomid = int(form.getvalue("id"))
    db = MySQLdb.connect(host = "localhost",
                         user = "hackrva_games",
                         db = "hackrva_games",
                         passwd = "")
    cur = db.cursor()
    cur.execute("""SELECT id, contents
      FROM offers WHERE room_id=%s LIMIT 1;""", (roomid, ))
    json.dump([{
      "id": offerid, 
      "contents": contents}
        for (offerid, contents) in cur], sock)
  except:
    print("A failure occurred ...")
    print(sys.exc_info())

main()

