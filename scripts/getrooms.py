#!/usr/bin/python2

import sys
import MySQLdb
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  cur.execute("""SELECT rooms.id, rooms.name, COUNT(offers.id) 
    FROM rooms 
    LEFT JOIN offers 
      ON rooms.id = offers.room_id 
    GROUP BY rooms.id;""")
  json.dump(
    [{"id": roomid, "name": name, "count": count} 
      for (roomid, name, count) in cur],
    sock)

def get_req(sock):
  wrap_db(db_ops, sock)

# Read from the rooms table
def main():
  wrap_cgi({'GET': get_req}, sys.stdout)

main()

